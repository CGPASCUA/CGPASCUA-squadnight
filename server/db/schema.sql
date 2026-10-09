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

-- Attendance votes for planned game nights. Existing sessions are preserved.
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS creator_username TEXT NOT NULL DEFAULT '';
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS creator_user_id UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS attendance JSONB NOT NULL DEFAULT '{}'::jsonb;


-- Squad data isolation: each session belongs to one squad. Legacy sessions are
-- assigned only when their creator's current squad can be identified.
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS squad_id UUID REFERENCES squads(id) ON DELETE CASCADE;
UPDATE sessions AS se
   SET squad_id = sm.squad_id
  FROM squad_members AS sm
 WHERE se.squad_id IS NULL
   AND se.creator_user_id IS NOT NULL
   AND sm.user_id = se.creator_user_id;

CREATE INDEX IF NOT EXISTS sessions_squad_date_idx ON sessions (squad_id, date DESC);

-- Game poll totals are stored per squad rather than on the shared game catalog.
CREATE TABLE IF NOT EXISTS squad_game_votes (
  squad_id UUID NOT NULL REFERENCES squads(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  votes INTEGER NOT NULL DEFAULT 0 CHECK (votes >= 0),
  PRIMARY KEY (squad_id, game_id)
);

-- Availability is private to a squad. The old singleton availability row is
-- retained for safe migration compatibility but is no longer read by the API.
CREATE TABLE IF NOT EXISTS squad_availability (
  squad_id UUID PRIMARY KEY REFERENCES squads(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- Each member has an independent weekly availability schedule.
-- This intentionally does not copy the old shared singleton schedule because
-- the old row does not record which account originally saved it.
CREATE TABLE IF NOT EXISTS member_availability (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  squad_id UUID NOT NULL REFERENCES squads(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS member_availability_squad_idx ON member_availability (squad_id);
