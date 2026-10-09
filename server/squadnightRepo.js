const json = (value) => (value == null ? null : JSON.stringify(value))

export async function listSessions(pool, squadId) {
  const { rows } = await pool.query(
    `SELECT id, game, to_char(date, 'YYYY-MM-DD') AS date, time,
            players, notes, status, report, creator_username, creator_user_id, attendance
       FROM sessions WHERE squad_id = $1
       ORDER BY date DESC, created_at DESC`,
    [squadId]
  )
  return rows
}

export async function getSession(pool, id, squadId) {
  const { rows } = await pool.query(
    `SELECT id, game, to_char(date, 'YYYY-MM-DD') AS date, time,
            players, notes, status, report, creator_username, creator_user_id, attendance
       FROM sessions WHERE id = $1 AND squad_id = $2`,
    [id, squadId]
  )
  return rows[0] ?? null
}

export async function createSession(pool, input, username = '', userId = null, squadId) {
  const id = crypto.randomUUID()
  const { rows } = await pool.query(
    `INSERT INTO sessions (id, squad_id, game, date, time, players, notes, status, report, creator_username, creator_user_id, attendance)
     VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7,'planned',NULL,$8,$9,'{}'::jsonb)
     RETURNING id, game, to_char(date, 'YYYY-MM-DD') AS date, time,
               players, notes, status, report, creator_username, creator_user_id, attendance`,
    [id, squadId, input.game, input.date, input.time, json(input.players), input.notes ?? '', username, userId]
  )
  return rows[0]
}

export async function updateSession(pool, id, patch, squadId) {
  const current = await getSession(pool, id, squadId)
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
     WHERE id=$8 AND squad_id=$9
     RETURNING id, game, to_char(date, 'YYYY-MM-DD') AS date, time,
               players, notes, status, report, creator_username, creator_user_id, attendance`,
    [next.game, next.date, next.time, json(next.players), next.notes,
     next.status, json(next.report), id, squadId]
  )
  return rows[0] ?? null
}

export async function listGames(pool, squadId) {
  const { rows } = await pool.query(
    `SELECT g.id, g.label, COALESCE(v.votes, 0)::int AS votes
       FROM games g
       LEFT JOIN squad_game_votes v ON v.game_id = g.id AND v.squad_id = $1
      ORDER BY g.label`,
    [squadId]
  )
  return rows
}

export async function voteGame(pool, id, squadId) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const game = await client.query('SELECT id FROM games WHERE id = $1', [id])
    if (!game.rowCount) { await client.query('ROLLBACK'); return null }
    await client.query(
      `INSERT INTO squad_game_votes (squad_id, game_id, votes) VALUES ($1, $2, 1)
       ON CONFLICT (squad_id, game_id) DO UPDATE SET votes = squad_game_votes.votes + 1`,
      [squadId, id]
    )
    await client.query('COMMIT')
    return await listGames(pool, squadId)
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally { client.release() }
}

export async function getAvailability(pool, squadId) {
  const { rows } = await pool.query(
    'SELECT data FROM squad_availability WHERE squad_id = $1',
    [squadId]
  )
  return rows[0]?.data ?? { mine: {}, others: [] }
}

export async function saveAvailability(pool, mine, squadId) {
  const current = await getAvailability(pool, squadId)
  const updated = { ...current, mine }
  const { rows } = await pool.query(
    `INSERT INTO squad_availability (squad_id, data) VALUES ($1, $2::jsonb)
     ON CONFLICT (squad_id) DO UPDATE SET data=EXCLUDED.data, updated_at=now()
     RETURNING data`,
    [squadId, json(updated)]
  )
  return rows[0].data
}

export async function voteAttendance(pool, id, userId, username, attending, squadId) {
  const { rows } = await pool.query(
    `UPDATE sessions
     SET attendance = COALESCE(attendance, '{}'::jsonb)
       || jsonb_build_object($3::text, $4::boolean)
     WHERE id = $1 AND squad_id = $2 AND status = 'planned'
     RETURNING id, attendance`,
    [id, squadId, username, attending]
  )
  return rows[0] ?? null
}

export async function deleteSession(pool, id, userId, squadId) {
  const result = await pool.query(
    'DELETE FROM sessions WHERE id=$1 AND creator_user_id=$2 AND squad_id=$3',
    [id, userId, squadId]
  )
  return result.rowCount > 0
}
