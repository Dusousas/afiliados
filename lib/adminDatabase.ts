import "server-only";

import { getDb } from "@/lib/db";
import {
  adminAffiliatesMock,
  adminCampaignMaterialsMock,
  adminCampaignsMock,
  adminCommissionsMock,
  adminCouponLinksMock,
  adminLeadsMock,
  adminPlatformSettingsMock,
} from "@/data/admin-mocks";
import {
  AdminDashboardMetrics,
  Affiliate,
  AffiliateStatus,
  Campaign,
  CampaignMaterial,
  Commission,
  CouponLink,
  Lead,
  PlatformSettings,
  RankingItem,
} from "@/types/admin";

let bootstrapPromise: Promise<void> | null = null;

const nowDate = () => new Date().toISOString().slice(0, 10);
const uid = (prefix: string) =>
  `${prefix}${Math.floor(Math.random() * 99999).toString().padStart(5, "0")}`;

function toDateString(value: unknown) {
  if (!value) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

function toNumber(value: unknown) {
  if (value == null) return 0;
  return Number(value);
}

function parseJson<T>(value: unknown, fallback: T): T {
  if (!value) return fallback;
  if (typeof value === "object") return value as T;
  try {
    return JSON.parse(String(value)) as T;
  } catch {
    return fallback;
  }
}

async function bootstrapDatabase() {
  const client = await getDb().connect();

  try {
    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS affiliates (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('active','pending','blocked')),
        joined_at DATE NOT NULL,
        last_active_at DATE NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id TEXT PRIMARY KEY,
        affiliate_id TEXT NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        origin TEXT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('new','qualified','proposal','won','lost')),
        potential_value NUMERIC(12,2) NOT NULL,
        created_at DATE NOT NULL,
        updated_at DATE NOT NULL,
        notes TEXT NOT NULL DEFAULT ''
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS commissions (
        id TEXT PRIMARY KEY,
        affiliate_id TEXT NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
        lead_id TEXT REFERENCES leads(id) ON DELETE SET NULL,
        order_id TEXT NOT NULL,
        order_value NUMERIC(12,2) NOT NULL,
        amount NUMERIC(12,2) NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('pending','approved','paid','cancelled')),
        created_at DATE NOT NULL,
        approved_at DATE,
        paid_at DATE
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS campaigns (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('draft','active','paused','ended')),
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        created_at DATE NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS campaign_materials (
        id TEXT PRIMARY KEY,
        campaign_id TEXT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('banner','link','copy','file','image')),
        description TEXT NOT NULL,
        url TEXT NOT NULL,
        file_name TEXT,
        is_published BOOLEAN NOT NULL DEFAULT TRUE,
        created_at DATE NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS coupons (
        id TEXT PRIMARY KEY,
        code TEXT NOT NULL UNIQUE,
        link TEXT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('active','inactive')),
        affiliate_id TEXT REFERENCES affiliates(id) ON DELETE SET NULL,
        discount_percent INTEGER NOT NULL,
        commission_percent INTEGER NOT NULL,
        created_at DATE NOT NULL,
        expires_at DATE
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id SMALLINT PRIMARY KEY CHECK (id = 1),
        default_commission_percent NUMERIC(8,2) NOT NULL,
        min_payout_amount NUMERIC(12,2) NOT NULL,
        program_status TEXT NOT NULL CHECK (program_status IN ('active','paused','maintenance')),
        rules JSONB NOT NULL,
        institutional_texts JSONB NOT NULL,
        visual JSONB NOT NULL,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    const affiliatesCountResult = await client.query<{ count: string }>(
      "SELECT COUNT(*)::text as count FROM affiliates"
    );
    const hasSeed = Number(affiliatesCountResult.rows[0]?.count ?? 0) > 0;

    if (!hasSeed) {
      for (const affiliate of adminAffiliatesMock) {
        await client.query(
          `
            INSERT INTO affiliates (
              id, name, email, phone, status, joined_at, last_active_at, city, state
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
            ON CONFLICT (id) DO NOTHING;
          `,
          [
            affiliate.id,
            affiliate.name,
            affiliate.email,
            affiliate.phone,
            affiliate.status,
            affiliate.joinedAt,
            affiliate.lastActiveAt,
            affiliate.city,
            affiliate.state,
          ]
        );
      }

      for (const lead of adminLeadsMock) {
        await client.query(
          `
            INSERT INTO leads (
              id, affiliate_id, name, origin, status, potential_value, created_at, updated_at, notes
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
            ON CONFLICT (id) DO NOTHING;
          `,
          [
            lead.id,
            lead.affiliateId,
            lead.name,
            lead.origin,
            lead.status,
            lead.potentialValue,
            lead.createdAt,
            lead.updatedAt,
            lead.notes,
          ]
        );
      }

      for (const commission of adminCommissionsMock) {
        await client.query(
          `
            INSERT INTO commissions (
              id, affiliate_id, lead_id, order_id, order_value, amount, status, created_at, approved_at, paid_at
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
            ON CONFLICT (id) DO NOTHING;
          `,
          [
            commission.id,
            commission.affiliateId,
            commission.leadId,
            commission.orderId,
            commission.orderValue,
            commission.amount,
            commission.status,
            commission.createdAt,
            commission.approvedAt ?? null,
            commission.paidAt ?? null,
          ]
        );
      }

      for (const campaign of adminCampaignsMock) {
        await client.query(
          `
            INSERT INTO campaigns (
              id, name, description, status, start_date, end_date, created_at
            ) VALUES ($1,$2,$3,$4,$5,$6,$7)
            ON CONFLICT (id) DO NOTHING;
          `,
          [
            campaign.id,
            campaign.name,
            campaign.description,
            campaign.status,
            campaign.startDate,
            campaign.endDate,
            campaign.createdAt,
          ]
        );
      }

      for (const material of adminCampaignMaterialsMock) {
        await client.query(
          `
            INSERT INTO campaign_materials (
              id, campaign_id, title, type, description, url, file_name, is_published, created_at
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
            ON CONFLICT (id) DO NOTHING;
          `,
          [
            material.id,
            material.campaignId,
            material.title,
            material.type,
            material.description,
            material.url,
            material.fileName ?? null,
            material.isPublished,
            material.createdAt,
          ]
        );
      }

      for (const coupon of adminCouponLinksMock) {
        await client.query(
          `
            INSERT INTO coupons (
              id, code, link, status, affiliate_id, discount_percent, commission_percent, created_at, expires_at
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
            ON CONFLICT (id) DO NOTHING;
          `,
          [
            coupon.id,
            coupon.code,
            coupon.link,
            coupon.status,
            coupon.affiliateId ?? null,
            coupon.discountPercent,
            coupon.commissionPercent,
            coupon.createdAt,
            coupon.expiresAt ?? null,
          ]
        );
      }

      await client.query(
        `
          INSERT INTO settings (
            id,
            default_commission_percent,
            min_payout_amount,
            program_status,
            rules,
            institutional_texts,
            visual
          ) VALUES (1,$1,$2,$3,$4::jsonb,$5::jsonb,$6::jsonb)
          ON CONFLICT (id) DO NOTHING;
        `,
        [
          adminPlatformSettingsMock.defaultCommissionPercent,
          adminPlatformSettingsMock.minPayoutAmount,
          adminPlatformSettingsMock.programStatus,
          JSON.stringify(adminPlatformSettingsMock.rules),
          JSON.stringify(adminPlatformSettingsMock.institutionalTexts),
          JSON.stringify(adminPlatformSettingsMock.visual),
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

export async function ensureAdminDatabaseReady() {
  if (!bootstrapPromise) {
    bootstrapPromise = bootstrapDatabase();
  }

  return bootstrapPromise;
}

async function queryAffiliatesWithStats() {
  const result = await getDb().query(
    `
      SELECT
        a.id,
        a.name,
        a.email,
        a.phone,
        a.status,
        a.joined_at,
        a.last_active_at,
        a.city,
        a.state,
        COALESCE(l.total_leads, 0)::int AS total_leads,
        COALESCE(l.total_conversions, 0)::int AS total_conversions,
        COALESCE(c.total_commissions, 0)::numeric AS total_commissions
      FROM affiliates a
      LEFT JOIN (
        SELECT
          affiliate_id,
          COUNT(*)::int AS total_leads,
          COUNT(*) FILTER (WHERE status = 'won')::int AS total_conversions
        FROM leads
        GROUP BY affiliate_id
      ) l ON l.affiliate_id = a.id
      LEFT JOIN (
        SELECT
          affiliate_id,
          SUM(amount)::numeric AS total_commissions
        FROM commissions
        GROUP BY affiliate_id
      ) c ON c.affiliate_id = a.id
      ORDER BY a.name;
    `
  );

  return result.rows.map((row) => ({
    id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    phone: String(row.phone),
    status: row.status as AffiliateStatus,
    joinedAt: toDateString(row.joined_at),
    lastActiveAt: toDateString(row.last_active_at),
    city: String(row.city),
    state: String(row.state),
    totalLeads: toNumber(row.total_leads),
    totalConversions: toNumber(row.total_conversions),
    totalCommissions: toNumber(row.total_commissions),
  })) as Affiliate[];
}

async function queryLeads() {
  const result = await getDb().query(
    `
      SELECT
        l.id,
        l.affiliate_id,
        a.name AS affiliate_name,
        l.name,
        l.origin,
        l.status,
        l.potential_value,
        l.created_at,
        l.updated_at,
        l.notes
      FROM leads l
      INNER JOIN affiliates a ON a.id = l.affiliate_id
      ORDER BY l.created_at DESC, l.id DESC;
    `
  );

  return result.rows.map((row) => ({
    id: String(row.id),
    affiliateId: String(row.affiliate_id),
    affiliateName: String(row.affiliate_name),
    name: String(row.name),
    origin: String(row.origin),
    status: row.status as Lead["status"],
    potentialValue: toNumber(row.potential_value),
    createdAt: toDateString(row.created_at),
    updatedAt: toDateString(row.updated_at),
    notes: String(row.notes ?? ""),
  })) as Lead[];
}

async function queryCommissions() {
  const result = await getDb().query(
    `
      SELECT
        c.id,
        c.affiliate_id,
        a.name AS affiliate_name,
        c.lead_id,
        c.order_id,
        c.order_value,
        c.amount,
        c.status,
        c.created_at,
        c.approved_at,
        c.paid_at
      FROM commissions c
      INNER JOIN affiliates a ON a.id = c.affiliate_id
      ORDER BY c.created_at DESC, c.id DESC;
    `
  );

  return result.rows.map((row) => ({
    id: String(row.id),
    affiliateId: String(row.affiliate_id),
    affiliateName: String(row.affiliate_name),
    leadId: String(row.lead_id ?? ""),
    orderId: String(row.order_id),
    orderValue: toNumber(row.order_value),
    amount: toNumber(row.amount),
    status: row.status as Commission["status"],
    createdAt: toDateString(row.created_at),
    approvedAt: row.approved_at ? toDateString(row.approved_at) : undefined,
    paidAt: row.paid_at ? toDateString(row.paid_at) : undefined,
  })) as Commission[];
}

async function queryCampaigns() {
  const result = await getDb().query("SELECT * FROM campaigns ORDER BY created_at DESC, id DESC");

  return result.rows.map((row) => ({
    id: String(row.id),
    name: String(row.name),
    description: String(row.description),
    status: row.status as Campaign["status"],
    startDate: toDateString(row.start_date),
    endDate: toDateString(row.end_date),
    createdAt: toDateString(row.created_at),
  })) as Campaign[];
}

async function queryCampaignMaterials() {
  const result = await getDb().query(
    "SELECT * FROM campaign_materials ORDER BY created_at DESC, id DESC"
  );

  return result.rows.map((row) => ({
    id: String(row.id),
    campaignId: String(row.campaign_id),
    title: String(row.title),
    type: row.type as CampaignMaterial["type"],
    description: String(row.description),
    url: String(row.url),
    fileName: row.file_name ? String(row.file_name) : undefined,
    isPublished: Boolean(row.is_published),
    createdAt: toDateString(row.created_at),
  })) as CampaignMaterial[];
}

async function queryCoupons() {
  const result = await getDb().query(
    `
      SELECT
        c.id,
        c.code,
        c.link,
        c.status,
        c.affiliate_id,
        a.name AS affiliate_name,
        c.discount_percent,
        c.commission_percent,
        c.created_at,
        c.expires_at
      FROM coupons c
      LEFT JOIN affiliates a ON a.id = c.affiliate_id
      ORDER BY c.created_at DESC, c.id DESC;
    `
  );

  return result.rows.map((row) => ({
    id: String(row.id),
    code: String(row.code),
    link: String(row.link),
    status: row.status as CouponLink["status"],
    affiliateId: row.affiliate_id ? String(row.affiliate_id) : undefined,
    affiliateName: row.affiliate_name ? String(row.affiliate_name) : undefined,
    discountPercent: toNumber(row.discount_percent),
    commissionPercent: toNumber(row.commission_percent),
    createdAt: toDateString(row.created_at),
    expiresAt: row.expires_at ? toDateString(row.expires_at) : undefined,
  })) as CouponLink[];
}

async function querySettings() {
  const result = await getDb().query("SELECT * FROM settings WHERE id = 1 LIMIT 1");
  const row = result.rows[0];

  if (!row) {
    return adminPlatformSettingsMock;
  }

  return {
    defaultCommissionPercent: toNumber(row.default_commission_percent),
    minPayoutAmount: toNumber(row.min_payout_amount),
    programStatus: row.program_status as PlatformSettings["programStatus"],
    rules: parseJson<string[]>(row.rules, []),
    institutionalTexts: parseJson<PlatformSettings["institutionalTexts"]>(
      row.institutional_texts,
      adminPlatformSettingsMock.institutionalTexts
    ),
    visual: parseJson<PlatformSettings["visual"]>(row.visual, adminPlatformSettingsMock.visual),
  } as PlatformSettings;
}

function buildMetrics(leads: Lead[], commissions: Commission[], affiliates: Affiliate[]) {
  const totalAffiliates = affiliates.length;
  const activeAffiliates = affiliates.filter((affiliate) => affiliate.status === "active").length;
  const totalCommissions = commissions.reduce((sum, item) => sum + item.amount, 0);
  const pendingCommissions = commissions
    .filter((item) => item.status === "pending")
    .reduce((sum, item) => sum + item.amount, 0);
  const paidCommissions = commissions
    .filter((item) => item.status === "paid")
    .reduce((sum, item) => sum + item.amount, 0);
  const totalLeads = leads.length;

  return {
    totalAffiliates,
    activeAffiliates,
    totalCommissions,
    pendingCommissions,
    paidCommissions,
    totalLeads,
  } satisfies AdminDashboardMetrics;
}

function buildRanking(affiliates: Affiliate[]): RankingItem[] {
  return affiliates
    .map((affiliate) => {
      const conversionRate = affiliate.totalLeads
        ? (affiliate.totalConversions / affiliate.totalLeads) * 100
        : 0;

      return {
        affiliateId: affiliate.id,
        affiliateName: affiliate.name,
        totalCommissions: affiliate.totalCommissions,
        totalLeads: affiliate.totalLeads,
        totalConversions: affiliate.totalConversions,
        conversionRate,
      };
    })
    .sort((a, b) => b.totalCommissions - a.totalCommissions);
}

export async function getAdminSnapshotFromDb() {
  await ensureAdminDatabaseReady();

  const [affiliates, leads, commissions, campaigns, materials, coupons, settings] =
    await Promise.all([
      queryAffiliatesWithStats(),
      queryLeads(),
      queryCommissions(),
      queryCampaigns(),
      queryCampaignMaterials(),
      queryCoupons(),
      querySettings(),
    ]);

  return {
    affiliates,
    leads,
    commissions,
    campaigns,
    materials,
    coupons,
    settings,
    metrics: buildMetrics(leads, commissions, affiliates),
    ranking: buildRanking(affiliates),
  };
}

export async function updateAffiliateInDb(
  id: string,
  payload: Partial<Pick<Affiliate, "name" | "email" | "phone" | "status" | "city" | "state">>
) {
  await ensureAdminDatabaseReady();

  const result = await getDb().query(
    `
      UPDATE affiliates
      SET
        name = COALESCE($2, name),
        email = COALESCE($3, email),
        phone = COALESCE($4, phone),
        status = COALESCE($5, status),
        city = COALESCE($6, city),
        state = COALESCE($7, state)
      WHERE id = $1
      RETURNING id;
    `,
    [
      id,
      payload.name ?? null,
      payload.email ?? null,
      payload.phone ?? null,
      payload.status ?? null,
      payload.city ?? null,
      payload.state ?? null,
    ]
  );

  return result.rows[0] ? true : false;
}

export async function toggleAffiliateStatusInDb(id: string) {
  await ensureAdminDatabaseReady();

  const result = await getDb().query(
    `
      UPDATE affiliates
      SET status = CASE WHEN status = 'blocked' THEN 'active' ELSE 'blocked' END
      WHERE id = $1
      RETURNING id;
    `,
    [id]
  );

  return result.rows[0] ? true : false;
}

export async function approveCommissionInDb(id: string) {
  await ensureAdminDatabaseReady();

  const result = await getDb().query(
    `
      UPDATE commissions
      SET status = 'approved', approved_at = $2
      WHERE id = $1 AND status = 'pending'
      RETURNING id;
    `,
    [id, nowDate()]
  );

  return result.rows[0] ? true : false;
}

export async function markCommissionAsPaidInDb(id: string) {
  await ensureAdminDatabaseReady();

  const result = await getDb().query(
    `
      UPDATE commissions
      SET status = 'paid', paid_at = $2
      WHERE id = $1 AND status = 'approved'
      RETURNING id;
    `,
    [id, nowDate()]
  );

  return result.rows[0] ? true : false;
}

export async function updateLeadInDb(
  id: string,
  payload: Partial<Pick<Lead, "status" | "notes" | "potentialValue">>
) {
  await ensureAdminDatabaseReady();

  const result = await getDb().query(
    `
      UPDATE leads
      SET
        status = COALESCE($2, status),
        notes = COALESCE($3, notes),
        potential_value = COALESCE($4, potential_value),
        updated_at = $5
      WHERE id = $1
      RETURNING id;
    `,
    [id, payload.status ?? null, payload.notes ?? null, payload.potentialValue ?? null, nowDate()]
  );

  return result.rows[0] ? true : false;
}

export async function createLeadInDb(payload: {
  affiliateId: string;
  name: string;
  origin: string;
  potentialValue: number;
  notes?: string;
}) {
  await ensureAdminDatabaseReady();

  const affiliateResult = await getDb().query("SELECT id, name FROM affiliates WHERE id = $1", [
    payload.affiliateId,
  ]);

  if (!affiliateResult.rows[0]) {
    return null;
  }

  const id = uid("L");

  await getDb().query(
    `
      INSERT INTO leads (
        id,
        affiliate_id,
        name,
        origin,
        status,
        potential_value,
        created_at,
        updated_at,
        notes
      ) VALUES ($1,$2,$3,$4,'new',$5,$6,$7,$8);
    `,
    [
      id,
      payload.affiliateId,
      payload.name,
      payload.origin || "Manual",
      payload.potentialValue,
      nowDate(),
      nowDate(),
      payload.notes ?? "",
    ]
  );

  return id;
}

export async function createCampaignInDb(payload: Omit<Campaign, "id" | "createdAt">) {
  await ensureAdminDatabaseReady();

  const id = uid("CP");

  await getDb().query(
    `
      INSERT INTO campaigns (id, name, description, status, start_date, end_date, created_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7);
    `,
    [id, payload.name, payload.description, payload.status, payload.startDate, payload.endDate, nowDate()]
  );

  return id;
}

export async function updateCampaignInDb(
  id: string,
  payload: Partial<Omit<Campaign, "id" | "createdAt">>
) {
  await ensureAdminDatabaseReady();

  const result = await getDb().query(
    `
      UPDATE campaigns
      SET
        name = COALESCE($2, name),
        description = COALESCE($3, description),
        status = COALESCE($4, status),
        start_date = COALESCE($5, start_date),
        end_date = COALESCE($6, end_date)
      WHERE id = $1
      RETURNING id;
    `,
    [
      id,
      payload.name ?? null,
      payload.description ?? null,
      payload.status ?? null,
      payload.startDate ?? null,
      payload.endDate ?? null,
    ]
  );

  return result.rows[0] ? true : false;
}

export async function createMaterialInDb(payload: Omit<CampaignMaterial, "id" | "createdAt">) {
  await ensureAdminDatabaseReady();

  const id = uid("MAT");

  await getDb().query(
    `
      INSERT INTO campaign_materials (
        id, campaign_id, title, type, description, url, file_name, is_published, created_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9);
    `,
    [
      id,
      payload.campaignId,
      payload.title,
      payload.type,
      payload.description,
      payload.url,
      payload.fileName ?? null,
      payload.isPublished,
      nowDate(),
    ]
  );

  return id;
}

export async function toggleMaterialPublishInDb(id: string) {
  await ensureAdminDatabaseReady();

  const result = await getDb().query(
    `
      UPDATE campaign_materials
      SET is_published = NOT is_published
      WHERE id = $1
      RETURNING id;
    `,
    [id]
  );

  return result.rows[0] ? true : false;
}

export async function createCouponInDb(payload: Omit<CouponLink, "id" | "createdAt">) {
  await ensureAdminDatabaseReady();

  const id = uid("CO");

  await getDb().query(
    `
      INSERT INTO coupons (
        id,
        code,
        link,
        status,
        affiliate_id,
        discount_percent,
        commission_percent,
        created_at,
        expires_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9);
    `,
    [
      id,
      payload.code,
      payload.link,
      payload.status,
      payload.affiliateId ?? null,
      payload.discountPercent,
      payload.commissionPercent,
      nowDate(),
      payload.expiresAt ?? null,
    ]
  );

  return id;
}

export async function updateCouponInDb(
  id: string,
  payload: Partial<Omit<CouponLink, "id" | "createdAt">>
) {
  await ensureAdminDatabaseReady();

  const result = await getDb().query(
    `
      UPDATE coupons
      SET
        code = COALESCE($2, code),
        link = COALESCE($3, link),
        status = COALESCE($4, status),
        affiliate_id = COALESCE($5, affiliate_id),
        discount_percent = COALESCE($6, discount_percent),
        commission_percent = COALESCE($7, commission_percent),
        expires_at = COALESCE($8, expires_at)
      WHERE id = $1
      RETURNING id;
    `,
    [
      id,
      payload.code ?? null,
      payload.link ?? null,
      payload.status ?? null,
      payload.affiliateId ?? null,
      payload.discountPercent ?? null,
      payload.commissionPercent ?? null,
      payload.expiresAt ?? null,
    ]
  );

  return result.rows[0] ? true : false;
}

export async function toggleCouponStatusInDb(id: string) {
  await ensureAdminDatabaseReady();

  const result = await getDb().query(
    `
      UPDATE coupons
      SET status = CASE WHEN status = 'active' THEN 'inactive' ELSE 'active' END
      WHERE id = $1
      RETURNING id;
    `,
    [id]
  );

  return result.rows[0] ? true : false;
}

export async function updateSettingsInDb(payload: Partial<PlatformSettings>) {
  await ensureAdminDatabaseReady();

  const current = await querySettings();
  const next: PlatformSettings = {
    ...current,
    ...payload,
    institutionalTexts: {
      ...current.institutionalTexts,
      ...(payload.institutionalTexts ?? {}),
    },
    visual: {
      ...current.visual,
      ...(payload.visual ?? {}),
    },
  };

  await getDb().query(
    `
      UPDATE settings
      SET
        default_commission_percent = $1,
        min_payout_amount = $2,
        program_status = $3,
        rules = $4::jsonb,
        institutional_texts = $5::jsonb,
        visual = $6::jsonb,
        updated_at = NOW()
      WHERE id = 1;
    `,
    [
      next.defaultCommissionPercent,
      next.minPayoutAmount,
      next.programStatus,
      JSON.stringify(next.rules),
      JSON.stringify(next.institutionalTexts),
      JSON.stringify(next.visual),
    ]
  );

  return next;
}

export async function getAffiliateDashboardDataFromDb(affiliateId: string) {
  await ensureAdminDatabaseReady();

  const [snapshot, settings] = await Promise.all([getAdminSnapshotFromDb(), querySettings()]);

  const affiliate = snapshot.affiliates.find((item) => item.id === affiliateId) ?? null;
  const leads = snapshot.leads.filter((item) => item.affiliateId === affiliateId);
  const commissions = snapshot.commissions.filter((item) => item.affiliateId === affiliateId);
  const coupons = snapshot.coupons.filter(
    (item) => item.status === "active" && (!item.affiliateId || item.affiliateId === affiliateId)
  );
  const campaigns = snapshot.campaigns.filter((item) => item.status === "active");
  const materials = snapshot.materials.filter((item) => item.isPublished);

  return {
    affiliate,
    leads,
    commissions,
    coupons,
    campaigns,
    materials,
    settings,
  };
}
