import { randomBytes, randomUUID, scrypt as scryptCallback, timingSafeEqual, createHash } from 'node:crypto'
import { promisify } from 'node:util'
const scrypt = promisify(scryptCallback)
const TOKEN_DAYS = 30
const normalize = (username) => username.trim().toLowerCase()
const hashToken = (token) => createHash('sha256').update(token).digest('hex')

async function hashPin(pin, salt) {
  return (await scrypt(pin, salt, 64)).toString('hex')
}

export async function register(pool, username, pin) {
  const cleanName = username.trim()
  const salt = randomBytes(16).toString('hex')
  const pinHash = await hashPin(pin, salt)
  try {
    const { rows } = await pool.query(
      `INSERT INTO users (username, username_normalized, pin_salt, pin_hash)
       VALUES ($1, $2, $3, $4) RETURNING id, username`,
      [cleanName, normalize(cleanName), salt, pinHash]
    )
    return rows[0]
  } catch (error) {
    if (error.code === '23505') {
      const conflict = new Error('That username already exists. Please log in instead.')
      conflict.status = 409
      throw conflict
    }
    throw error
  }
}

export async function login(pool, username, pin) {
  const { rows } = await pool.query(
    'SELECT id, username, pin_salt, pin_hash FROM users WHERE username_normalized = $1',
    [normalize(username)]
  )
  const user = rows[0]
  if (!user) return null
  const supplied = Buffer.from(await hashPin(pin, user.pin_salt), 'hex')
  const stored = Buffer.from(user.pin_hash, 'hex')
  if (supplied.length !== stored.length || !timingSafeEqual(supplied, stored)) return null
  return { id: user.id, username: user.username }
}

export async function createSession(pool, user) {
  const token = randomBytes(32).toString('base64url')
  const expiresAt = new Date(Date.now() + TOKEN_DAYS * 24 * 60 * 60 * 1000)
  await pool.query(
    'INSERT INTO auth_sessions (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
    [user.id, hashToken(token), expiresAt]
  )
  return { token, expiresAt: expiresAt.toISOString(), user }
}

export async function getUserForToken(pool, token) {
  if (!token) return null
  const { rows } = await pool.query(
    `SELECT u.id, u.username FROM auth_sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = $1 AND s.expires_at > now()`, [hashToken(token)]
  )
  return rows[0] ?? null
}

export async function revokeToken(pool, token) {
  if (!token) return
  await pool.query('DELETE FROM auth_sessions WHERE token_hash = $1', [hashToken(token)])
}

export function bearerToken(req) {
  const value = req.get('authorization') || ''
  return value.startsWith('Bearer ') ? value.slice(7) : ''
}
