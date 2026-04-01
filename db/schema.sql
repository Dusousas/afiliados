-- Schema PostgreSQL para Easypanel

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

CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft','active','paused','ended')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at DATE NOT NULL
);

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

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMP NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
