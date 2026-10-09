import { randomBytes, randomUUID } from 'node:crypto'

function makeCode() {
  return randomBytes(4).toString('hex').toUpperCase()
}

export async function getMySquad(pool, userId) {
  const { rows } = await pool.query(
    `SELECT s.id, s.name, s.join_code AS "joinCode", s.created_by AS "createdBy",
            sm.role, sm.joined_at AS "joinedAt"
       FROM squad_members sm JOIN squads s ON s.id = sm.squad_id
      WHERE sm.user_id = $1`, [userId]
  )
  if (!rows[0]) return null
  const squad = rows[0]
  const membersResult = await pool.query(
    `SELECT u.id, u.username, sm.role, sm.joined_at AS "joinedAt"
       FROM squad_members sm JOIN users u ON u.id = sm.user_id
      WHERE sm.squad_id = $1 ORDER BY sm.joined_at, u.username`, [squad.id]
  )
  return { ...squad, members: membersResult.rows }
}

export async function createSquad(pool, userId, name) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const existing = await client.query('SELECT 1 FROM squad_members WHERE user_id=$1', [userId])
    if (existing.rowCount) {
      const error = new Error('You already belong to a squad.')
      error.status = 409
      throw error
    }
    let squad
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        const result = await client.query(
          `INSERT INTO squads (id, name, join_code, created_by) VALUES ($1,$2,$3,$4)
           RETURNING id, name, join_code AS "joinCode", created_by AS "createdBy"`,
          [randomUUID(), name.trim(), makeCode(), userId]
        )
        squad = result.rows[0]
        break
      } catch (error) {
        if (error.code !== '23505' || attempt === 4) throw error
      }
    }
    await client.query(`INSERT INTO squad_members (squad_id,user_id,role) VALUES ($1,$2,'owner')`, [squad.id, userId])
    await client.query('COMMIT')
    return await getMySquad(pool, userId)
  } catch (error) {
    await client.query('ROLLBACK')
    if (error.code === '23505') { error.status = 409; error.message = 'That squad name or join code could not be saved. Please try again.' }
    throw error
  } finally { client.release() }
}

export async function joinSquad(pool, userId, code) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const existing = await client.query('SELECT 1 FROM squad_members WHERE user_id=$1', [userId])
    if (existing.rowCount) {
      const error = new Error('You already belong to a squad.')
      error.status = 409
      throw error
    }
    const found = await client.query('SELECT id FROM squads WHERE join_code=$1', [code.trim().toUpperCase()])
    if (!found.rowCount) {
      const error = new Error('That squad code was not found. Check the code and try again.')
      error.status = 404
      throw error
    }
    await client.query(`INSERT INTO squad_members (squad_id,user_id,role) VALUES ($1,$2,'member')`, [found.rows[0].id, userId])
    await client.query('COMMIT')
    return await getMySquad(pool, userId)
  } catch (error) {
    await client.query('ROLLBACK')
    if (error.code === '23505') { error.status = 409; error.message = 'You already belong to a squad.' }
    throw error
  } finally { client.release() }
}

export async function leaveSquad(pool, userId) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const membership = await client.query(
      `SELECT sm.squad_id AS "squadId", sm.role, s.created_by AS "createdBy",
              (SELECT count(*)::int FROM squad_members x WHERE x.squad_id=sm.squad_id) AS "memberCount"
         FROM squad_members sm JOIN squads s ON s.id=sm.squad_id
        WHERE sm.user_id=$1 FOR UPDATE OF sm`, [userId]
    )
    if (!membership.rowCount) {
      const error = new Error('You are not currently in a squad.')
      error.status = 404
      throw error
    }
    const current = membership.rows[0]
    if (current.role === 'owner' && current.memberCount > 1) {
      const error = new Error('As the owner, transfer ownership before leaving this squad.')
      error.status = 409
      throw error
    }
    await client.query('DELETE FROM squad_members WHERE user_id=$1', [userId])
    if (current.memberCount === 1) await client.query('DELETE FROM squads WHERE id=$1', [current.squadId])
    await client.query('COMMIT')
    return { ok: true }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally { client.release() }
}
