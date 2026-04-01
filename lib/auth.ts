import "server-only";

import { createHash, randomBytes, randomUUID, scrypt as nodeScrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { ensureAdminDatabaseReady } from "@/lib/adminDatabase";
import { AuthUser, UserRole } from "@/types/auth";

const scrypt = promisify(nodeScrypt);
const SESSION_COOKIE_NAME = "afiliados_session";
const SESSION_DURATION_DAYS = 30;

let authBootstrapPromise: Promise<void> | null = null;

type DbUserRow = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  username: string | null;
  phone: string | null;
  affiliate_id: string | null;
};

export class AuthError extends Error {
  status: number;

  constructor(message: string, status = 401) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}

function nowDate() {
  return new Date().toISOString().slice(0, 10);
}

function makeId(prefix: string) {
  return `${prefix}${Math.floor(Math.random() * 99999)
    .toString()
    .padStart(5, "0")}`;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizeUsername(value: string) {
  const normalized = value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9.]+/g, ".")
    .replace(/\.{2,}/g, ".")
    .replace(/^\.|\.$/g, "");

  return normalized || "usuario";
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function mapUser(row: DbUserRow): AuthUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    username: row.username,
    phone: row.phone,
    affiliateId: row.affiliate_id,
  };
}

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

async function verifyPassword(password: string, storedHash: string) {
  const [salt, key] = storedHash.split(":");

  if (!salt || !key) {
    return false;
  }

  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  const storedKey = Buffer.from(key, "hex");

  if (storedKey.length !== derivedKey.length) {
    return false;
  }

  return timingSafeEqual(storedKey, derivedKey);
}

async function findUniqueUsername(base: string) {
  const normalizedBase = normalizeUsername(base);

  for (let attempt = 0; attempt < 20; attempt += 1) {
    const candidate =
      attempt === 0 ? normalizedBase : `${normalizedBase}.${randomBytes(2).toString("hex")}`;

    const existing = await getDb().query<{ id: string }>(
      "SELECT id FROM users WHERE username = $1 LIMIT 1",
      [candidate]
    );

    if (!existing.rows[0]) {
      return candidate;
    }
  }

  return `${normalizedBase}.${randomUUID().slice(0, 8)}`;
}

async function bootstrapAuth() {
  await ensureAdminDatabaseReady();

  const client = await getDb().connect();

  try {
    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        username TEXT NOT NULL UNIQUE,
        phone TEXT NOT NULL DEFAULT '',
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('admin','affiliate')),
        affiliate_id TEXT UNIQUE REFERENCES affiliates(id) ON DELETE SET NULL,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token_hash TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        last_seen_at TIMESTAMP NOT NULL DEFAULT NOW(),
        expires_at TIMESTAMP NOT NULL
      );
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
    `);

    const adminEmail = normalizeEmail(process.env.ADMIN_EMAIL ?? "admin@youon.com");
    const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin123!";
    const adminHash = await hashPassword(adminPassword);

    await client.query(
      `
        INSERT INTO users (
          id,
          name,
          email,
          username,
          phone,
          password_hash,
          role,
          affiliate_id
        ) VALUES ($1,$2,$3,$4,$5,$6,'admin',NULL)
        ON CONFLICT (email) DO NOTHING;
      `,
      ["USR-ADMIN", "Admin Master", adminEmail, "admin", "", adminHash]
    );

    const affiliatePassword = process.env.AFFILIATE_DEFAULT_PASSWORD ?? "Afiliado123!";
    const affiliateHash = await hashPassword(affiliatePassword);
    const affiliatesResult = await client.query<{
      id: string;
      name: string;
      email: string;
      phone: string;
    }>("SELECT id, name, email, phone FROM affiliates ORDER BY joined_at ASC, id ASC");

    for (const affiliate of affiliatesResult.rows) {
      const username = normalizeUsername(`${affiliate.name}.${affiliate.id}`);

      await client.query(
        `
          INSERT INTO users (
            id,
            name,
            email,
            username,
            phone,
            password_hash,
            role,
            affiliate_id
          ) VALUES ($1,$2,$3,$4,$5,$6,'affiliate',$7)
          ON CONFLICT (email) DO NOTHING;
        `,
        [
          `USR-${affiliate.id}`,
          affiliate.name,
          normalizeEmail(affiliate.email),
          username,
          affiliate.phone ?? "",
          affiliateHash,
          affiliate.id,
        ]
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function ensureAuthReady() {
  if (!authBootstrapPromise) {
    authBootstrapPromise = bootstrapAuth();
  }

  return authBootstrapPromise;
}

async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000);

  await getDb().query(
    `
      INSERT INTO sessions (id, user_id, token_hash, expires_at)
      VALUES ($1,$2,$3,$4);
    `,
    [`SES-${randomUUID()}`, userId, tokenHash, expiresAt.toISOString()]
  );

  return token;
}

async function getUserByEmail(email: string) {
  await ensureAuthReady();

  const result = await getDb().query<
    DbUserRow & {
      password_hash: string;
      is_active: boolean;
    }
  >(
    `
      SELECT id, name, email, role, username, phone, affiliate_id, password_hash, is_active
      FROM users
      WHERE email = $1
      LIMIT 1;
    `,
    [normalizeEmail(email)]
  );

  return result.rows[0] ?? null;
}

export async function registerAffiliateUser(payload: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}) {
  await ensureAuthReady();

  const email = normalizeEmail(payload.email);
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    throw new AuthError("Ja existe uma conta com este email.", 409);
  }

  const client = await getDb().connect();

  try {
    await client.query("BEGIN");

    const affiliateId = makeId("A");
    const userId = `USR-${affiliateId}`;
    const username = await findUniqueUsername(payload.name || email.split("@")[0] || affiliateId);
    const passwordHash = await hashPassword(payload.password);

    await client.query(
      `
        INSERT INTO affiliates (
          id, name, email, phone, status, joined_at, last_active_at, city, state
        ) VALUES ($1,$2,$3,$4,'pending',$5,$6,$7,$8);
      `,
      [
        affiliateId,
        payload.name.trim(),
        email,
        payload.phone?.trim() ?? "",
        nowDate(),
        nowDate(),
        "Nao informado",
        "NA",
      ]
    );

    await client.query(
      `
        INSERT INTO users (
          id,
          name,
          email,
          username,
          phone,
          password_hash,
          role,
          affiliate_id
        ) VALUES ($1,$2,$3,$4,$5,$6,'affiliate',$7);
      `,
      [userId, payload.name.trim(), email, username, payload.phone?.trim() ?? "", passwordHash, affiliateId]
    );

    await client.query("COMMIT");

    const user: AuthUser = {
      id: userId,
      name: payload.name.trim(),
      email,
      role: "affiliate",
      username,
      phone: payload.phone?.trim() ?? "",
      affiliateId,
    };

    const token = await createSession(user.id);
    return { user, token };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function loginWithEmail(payload: { email: string; password: string }) {
  await ensureAuthReady();

  const user = await getUserByEmail(payload.email);

  if (!user || !user.is_active) {
    throw new AuthError("Email ou senha invalidos.", 401);
  }

  const passwordMatches = await verifyPassword(payload.password, user.password_hash);

  if (!passwordMatches) {
    throw new AuthError("Email ou senha invalidos.", 401);
  }

  if (user.affiliate_id) {
    await getDb().query("UPDATE affiliates SET last_active_at = $2 WHERE id = $1", [
      user.affiliate_id,
      nowDate(),
    ]);
  }

  const token = await createSession(user.id);
  return { user: mapUser(user), token };
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return null;
  }

  await ensureAuthReady();

  const result = await getDb().query<DbUserRow>(
    `
      SELECT u.id, u.name, u.email, u.role, u.username, u.phone, u.affiliate_id
      FROM sessions s
      INNER JOIN users u ON u.id = s.user_id
      WHERE s.token_hash = $1
        AND s.expires_at > NOW()
        AND u.is_active = TRUE
      LIMIT 1;
    `,
    [hashToken(sessionToken)]
  );

  const row = result.rows[0];

  if (!row) {
    return null;
  }

  await getDb().query(
    `
      UPDATE sessions
      SET last_seen_at = NOW()
      WHERE token_hash = $1;
    `,
    [hashToken(sessionToken)]
  );

  return mapUser(row);
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();

  if (!user) {
    throw new AuthError("Sessao expirada. Faca login novamente.", 401);
  }

  return user;
}

export async function requireAdminUser() {
  const user = await requireCurrentUser();

  if (user.role !== "admin") {
    throw new AuthError("Acesso admin nao autorizado.", 403);
  }

  return user;
}

export async function requireAffiliateUser() {
  const user = await requireCurrentUser();

  if (user.role !== "affiliate" || !user.affiliateId) {
    throw new AuthError("Acesso do afiliado nao autorizado.", 403);
  }

  return user as AuthUser & { affiliateId: string };
}

export async function logoutCurrentSession() {
  await ensureAuthReady();

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return;
  }

  await getDb().query("DELETE FROM sessions WHERE token_hash = $1", [hashToken(sessionToken)]);
}

export function applySessionCookie(response: NextResponse, sessionToken: string) {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: sessionToken,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60,
  });

  return response;
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}

export function getRedirectPathForRole(role: UserRole) {
  return role === "admin" ? "/admin" : "/dashboard";
}

export async function getAccountProfile() {
  const user = await requireCurrentUser();

  return {
    name: user.name,
    email: user.email,
    username: user.username ?? "",
    phone: user.phone ?? "",
    role: user.role,
    affiliateId: user.affiliateId ?? null,
  };
}

export async function updateCurrentUserProfile(payload: {
  name?: string;
  email?: string;
  username?: string;
  phone?: string;
}) {
  await ensureAuthReady();

  const currentUser = await requireCurrentUser();
  const nextEmail = payload.email ? normalizeEmail(payload.email) : currentUser.email;
  const requestedUsername = payload.username ? normalizeUsername(payload.username) : null;
  let nextUsername = currentUser.username ?? normalizeUsername(currentUser.name);

  if (requestedUsername && requestedUsername !== currentUser.username) {
    nextUsername = await findUniqueUsername(requestedUsername);
  } else if (!currentUser.username) {
    nextUsername = await findUniqueUsername(nextUsername);
  }

  const emailOwner = await getDb().query<{ id: string }>(
    "SELECT id FROM users WHERE email = $1 AND id <> $2 LIMIT 1",
    [nextEmail, currentUser.id]
  );

  if (emailOwner.rows[0]) {
    throw new AuthError("Este email ja esta em uso por outra conta.", 409);
  }

  const usernameOwner = await getDb().query<{ id: string }>(
    "SELECT id FROM users WHERE username = $1 AND id <> $2 LIMIT 1",
    [nextUsername, currentUser.id]
  );

  if (usernameOwner.rows[0]) {
    throw new AuthError("Este nome de usuario ja esta em uso.", 409);
  }

  await getDb().query(
    `
      UPDATE users
      SET
        name = COALESCE($2, name),
        email = $3,
        username = $4,
        phone = COALESCE($5, phone),
        updated_at = NOW()
      WHERE id = $1;
    `,
    [
      currentUser.id,
      payload.name?.trim() || null,
      nextEmail,
      nextUsername,
      payload.phone?.trim() ?? null,
    ]
  );

  if (currentUser.affiliateId) {
    await getDb().query(
      `
        UPDATE affiliates
        SET
          name = COALESCE($2, name),
          email = $3,
          phone = COALESCE($4, phone),
          last_active_at = $5
        WHERE id = $1;
      `,
      [
        currentUser.affiliateId,
        payload.name?.trim() || null,
        nextEmail,
        payload.phone?.trim() ?? null,
        nowDate(),
      ]
    );
  }

  return getAccountProfile();
}
