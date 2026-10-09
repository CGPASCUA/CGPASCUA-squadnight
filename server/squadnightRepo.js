const json = (value) => (value == null ? null : JSON.stringify(value))

export async function listSessions(pool) {
  const { rows } = await pool.query(
    `SELECT id, game, to_char(date, 'YYYY-MM-DD') AS date, time,
            players, notes, status, report, creator_username, creator_user_id, attendance
       FROM sessions ORDER BY date DESC, created_at DESC`
  )
  return rows
}

export async function getSession(pool, id) {
  const { rows } = await pool.query(
    `SELECT id, game, to_char(date, 'YYYY-MM-DD') AS date, time,
            players, notes, status, report, creator_username, creator_user_id, attendance
       FROM sessions WHERE id = $1`, [id]
  )
  return rows[0] ?? null
}

export async function createSession(pool, input, username = '', userId = null) {
  const id = crypto.randomUUID()
  const { rows } = await pool.query(
    `INSERT INTO sessions (id, game, date, time, players, notes, status, report, creator_username, creator_user_id, attendance)
     VALUES ($1,$2,$3,$4,$5::jsonb,$6,'planned',NULL,$7,'{}'::jsonb)
     RETURNING id, game, to_char(date, 'YYYY-MM-DD') AS date, time,
               players, notes, status, report, creator_username, creator_user_id, attendance`,
    [id, input.game, input.date, input.time, json(input.players), input.notes ?? '', username, userId]
  )
  return rows[0]
}

export async function updateSession(pool, id, patch) {
  const current = await getSession(pool, id)
  if (!current) return null
  const next = {
    game: patch.game ?? current.game,
    date: patch.date ?? current.date,
    time: patch.time ?? current.time,
    players: patch.players ?? current.players,
    notes: patch.notes ?? current.notes,
    status: patch.status ?? current.status,
    report: patch.report === undefined ? current.report : patch.report,
  }
  const { rows } = await pool.query(
    `UPDATE sessions SET game=$1, date=$2, time=$3, players=$4::jsonb,
       notes=$5, status=$6, report=$7::jsonb
     WHERE id=$8
     RETURNING id, game, to_char(date, 'YYYY-MM-DD') AS date, time,
               players, notes, status, report, creator_username, creator_user_id, attendance`,
    [next.game, next.date, next.time, json(next.players), next.notes,
     next.status, json(next.report), id]
  )
  return rows[0] ?? null
}

export async function listGames(pool) {
  const { rows } = await pool.query('SELECT id, label, votes FROM games ORDER BY label')
  return rows
}

export async function voteGame(pool, id) {
  const result = await pool.query(
    'UPDATE games SET votes = votes + 1 WHERE id = $1 RETURNING id', [id]
  )
  if (!result.rowCount) return null
  return listGames(pool)
}

export async function getAvailability(pool) {
  const { rows } = await pool.query('SELECT data FROM availability WHERE id=1')
  return rows[0]?.data ?? { mine: {}, others: [] }
}

export async function saveAvailability(pool, mine) {
  const current = await getAvailability(pool)
  const updated = { ...current, mine }
  const { rows } = await pool.query(
    `INSERT INTO availability (id, data) VALUES (1, $1::jsonb)
     ON CONFLICT (id) DO UPDATE SET data=EXCLUDED.data RETURNING data`,
    [json(updated)]
  )
  return rows[0].data
}

export async function voteAttendance(pool, id, userId, username, attending) {
  const { rows } = await pool.query(
    `UPDATE sessions SET attendance = COALESCE(attendance, '{}'::jsonb) || jsonb_build_object($2, $3::boolean)
     WHERE id=$1 AND status='planned'
     RETURNING id, attendance`, [id, username, attending]
  )
  return rows[0] ?? null
}

export async function deleteSession(pool, id, userId) {
  const result = await pool.query('DELETE FROM sessions WHERE id=$1 AND creator_user_id=$2', [id, userId])
  return result.rowCount > 0
}
