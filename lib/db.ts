import "server-only";
import { Pool } from "pg";

declare global {
  var __afiliadosPgPool: Pool | undefined;
}

function createPool() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL nao configurada. Defina no .env.local ou no Easypanel.");
  }

  const useSSL = process.env.DATABASE_SSL === "true";

  return new Pool({
    connectionString,
    ssl: useSSL ? { rejectUnauthorized: false } : undefined,
  });
}

function getOrCreatePool() {
  if (!global.__afiliadosPgPool) {
    global.__afiliadosPgPool = createPool();
  }

  return global.__afiliadosPgPool;
}

export function getDb() {
  return getOrCreatePool();
}
