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

-- Squads: each user may belong to one squad at a time; creators are the first member.
CREATE TABLE IF NOT EXISTS squads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 2 AND 60),
  join_code TEXT NOT NULL UNIQUE,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS squad_members (
  squad_id UUID NOT NULL REFERENCES squads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'member')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (squad_id, user_id),
  UNIQUE (user_id)
);
CREATE INDEX IF NOT EXISTS squad_members_squad_idx ON squad_members (squad_id, joined_at);


-- Useful membership lookup and consistency support for the live PostgreSQL database.
CREATE INDEX IF NOT EXISTS squads_created_by_idx ON squads (created_by);
CREATE INDEX IF NOT EXISTS squad_members_user_idx ON squad_members (user_id);
