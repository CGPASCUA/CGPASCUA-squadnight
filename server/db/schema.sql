CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  game TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  players JSONB NOT NULL DEFAULT '[]'::jsonb,
  notes TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'completed')),
  report JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS sessions_date_idx ON sessions (date DESC);

CREATE TABLE IF NOT EXISTS games (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  votes INTEGER NOT NULL DEFAULT 0 CHECK (votes >= 0)
);

CREATE TABLE IF NOT EXISTS availability (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  data JSONB NOT NULL
);


-- Account credentials are stored as salted scrypt hashes, never as plain-text PINs.
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL,
  username_normalized TEXT NOT NULL UNIQUE,
  pin_salt TEXT NOT NULL,
  pin_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS auth_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS auth_sessions_expiry_idx ON auth_sessions (expires_at);
