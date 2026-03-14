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

export const db = global.__afiliadosPgPool ?? createPool();

if (process.env.NODE_ENV !== "production") {
  global.__afiliadosPgPool = db;
}
