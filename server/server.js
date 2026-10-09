import express from 'express'
import cors from 'cors'
import { pool } from './db/pool.js'
import * as repo from './squadnightRepo.js'
import * as auth from './auth.js'
import * as squads from './squadsRepo.js'

const app = express()
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',').map((origin) => origin.trim()).filter(Boolean)
app.use(cors({ origin: allowedOrigins }))
app.use(express.json({ limit: '100kb' }))

app.post('/api/auth/register', async (req, res, next) => {
  const username = typeof req.body?.username === 'string' ? req.body.username.trim() : ''
  const pin = typeof req.body?.pin === 'string' ? req.body.pin : ''
  if (username.length < 2 || username.length > 40 || !/^[\p{L}\p{N} _.-]+$/u.test(username)) {
    return res.status(400).json({ error: 'Username must be 2–40 characters and use letters, numbers, spaces, dots, underscores, or hyphens.' })
  }
  if (!/^\d{4}$/.test(pin)) return res.status(400).json({ error: 'Passcode must be exactly 4 digits.' })
  try {
    const user = await auth.register(pool, username, pin)
    const session = await auth.createSession(pool, user)
    res.status(201).json(session)
  } catch (error) { if (error.status) return res.status(error.status).json({ error: error.message }); next(error) }
})
app.post('/api/auth/login', async (req, res, next) => {
  const username = typeof req.body?.username === 'string' ? req.body.username.trim() : ''
  const pin = typeof req.body?.pin === 'string' ? req.body.pin : ''
  if (!username || !/^\d{4}$/.test(pin)) return res.status(400).json({ error: 'Enter your username and 4-digit passcode.' })
  try {
    const user = await auth.login(pool, username, pin)
    if (!user) return res.status(401).json({ error: 'Incorrect username or passcode.' })
    res.json(await auth.createSession(pool, user))
  } catch (error) { next(error) }
})
app.post('/api/auth/logout', async (req, res, next) => {
  try { await auth.revokeToken(pool, auth.bearerToken(req)); res.status(204).end() }
  catch (error) { next(error) }
})
app.get('/api/auth/me', async (req, res, next) => {
  try {
    const user = await auth.getUserForToken(pool, auth.bearerToken(req))
    if (!user) return res.status(401).json({ error: 'Please log in again.' })
    res.json({ user })
  } catch (error) { next(error) }
})

// All application data endpoints require a valid, unexpired account session.
app.use('/api', async (req, res, next) => {
  if (req.path.startsWith('/auth/')) return next()
  try {
    const user = await auth.getUserForToken(pool, auth.bearerToken(req))
    if (!user) return res.status(401).json({ error: 'Please log in to continue.' })
    req.user = user
    next()
  } catch (error) { next(error) }
})

// Resolve the current account's squad for every squad-owned API operation.
async function requireSquad(req, res, next) {
  try {
    const { rows } = await pool.query(
      'SELECT squad_id FROM squad_members WHERE user_id = $1 LIMIT 1',
      [req.user.id]
    )
    if (!rows[0]) return res.status(409).json({ error: 'Join or create a squad first.' })
    req.squadId = rows[0].squad_id
    next()
  } catch (error) { next(error) }
}

// Squad membership is always tied to the authenticated account.
app.get('/api/squads/me', async (req, res, next) => {
  try { res.json({ squad: await squads.getMySquad(pool, req.user.id) }) } catch (error) { next(error) }
})
app.post('/api/squads', async (req, res, next) => {
  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : ''
  if (name.length < 2 || name.length > 60) return res.status(400).json({ error: 'Squad name must be 2–60 characters.' })
  try { res.status(201).json({ squad: await squads.createSquad(pool, req.user.id, name) }) }
  catch (error) { if (error.status) return res.status(error.status).json({ error: error.message }); next(error) }
})
app.post('/api/squads/leave', async (req, res, next) => {
  try { res.json(await squads.leaveSquad(pool, req.user.id)) }
  catch (error) { if (error.status) return res.status(error.status).json({ error: error.message }); next(error) }
})
app.post('/api/squads/join', async (req, res, next) => {
  const code = typeof req.body?.code === 'string' ? req.body.code.trim() : ''
  if (!/^[A-Z0-9]{8}$/i.test(code)) return res.status(400).json({ error: 'Enter the 8-character squad code.' })
  try { res.json({ squad: await squads.joinSquad(pool, req.user.id, code) }) }
  catch (error) { if (error.status) return res.status(error.status).json({ error: error.message }); next(error) }
})

app.get('/healthz', (_req, res) => res.json({ ok: true }))
app.get('/readyz', async (_req, res) => {
  try { await pool.query('SELECT 1'); res.json({ ok: true, db: 'up' }) }
  catch (error) { console.error('readyz failed:', error.message); res.status(503).json({ ok: false, db: 'down' }) }
})

const fail = (res, message) => res.status(400).json({ error: message })
function validateSession(body, partial = false) {
  const errors = []
  const value = {}
  for (const key of ['game', 'date', 'time']) {
    if (partial && body[key] === undefined) continue
    if (typeof body[key] !== 'string' || !body[key].trim()) errors.push(`${key} is required`)
    else value[key] = body[key].trim()
  }
  if (value.game && value.game.length > 100) errors.push('game must be 100 characters or fewer')
  if (value.date && !/^\d{4}-\d{2}-\d{2}$/.test(value.date)) errors.push('date must use YYYY-MM-DD')
  if (value.time && !/^\d{2}:\d{2}$/.test(value.time)) errors.push('time must use HH:MM')
  if (!partial || body.players !== undefined) {
    if (body.players !== undefined && (!Array.isArray(body.players) || body.players.length > 30 || body.players.some(p => typeof p !== 'string' || p.length > 80))) errors.push('players must be a list of up to 30 names')
    else value.players = body.players ?? []
  }
  if (!partial || body.notes !== undefined) {
    if (body.notes !== undefined && (typeof body.notes !== 'string' || body.notes.length > 2000)) errors.push('notes must be 2000 characters or fewer')
    else value.notes = body.notes ?? ''
  }
  if (body.status !== undefined) {
    if (!['planned', 'completed'].includes(body.status)) errors.push('status must be planned or completed')
    else value.status = body.status
  }
  if (body.report !== undefined) {
    if (body.report !== null && (typeof body.report !== 'object' || Array.isArray(body.report))) errors.push('report must be an object or null')
    else value.report = body.report
  }
  return { errors, value }
}

app.get('/api/sessions', requireSquad, async (req, res, next) => {
  try { res.json(await repo.listSessions(pool, req.squadId)) } catch (e) { next(e) }
})
app.get('/api/sessions/:id', requireSquad, async (req, res, next) => {
  try { const row = await repo.getSession(pool, req.params.id, req.squadId); if (!row) return res.status(404).json({ error: 'Session not found' }); res.json(row) } catch (e) { next(e) }
})
app.post('/api/sessions', requireSquad, async (req, res, next) => {
  const { errors, value } = validateSession(req.body ?? {})
  if (errors.length) return fail(res, errors.join('; '))
  try { res.status(201).json(await repo.createSession(pool, value, req.user.username, req.user.id, req.squadId)) } catch (e) { next(e) }
})
app.put('/api/sessions/:id/attendance', requireSquad, async (req, res, next) => {
  if (typeof req.body?.attending !== 'boolean') return fail(res, 'attending must be true or false')
  try { const row = await repo.voteAttendance(pool, req.params.id, req.user.id, req.user.username, req.body.attending, req.squadId); if (!row) return res.status(404).json({ error: 'Planned session not found' }); res.json(row) } catch (e) { next(e) }
})
app.delete('/api/sessions/:id', requireSquad, async (req, res, next) => {
  try { const deleted = await repo.deleteSession(pool, req.params.id, req.user.id, req.squadId); if (!deleted) return res.status(404).json({ error: 'Session not found' }); res.status(204).end() } catch (e) { next(e) }
})

app.patch('/api/sessions/:id', requireSquad, async (req, res, next) => {
  const { errors, value } = validateSession(req.body ?? {}, true)
  if (errors.length) return fail(res, errors.join('; '))
  try { const row = await repo.updateSession(pool, req.params.id, value, req.squadId); if (!row) return res.status(404).json({ error: 'Session not found' }); res.json(row) } catch (e) { next(e) }
})
app.get('/api/games', requireSquad, async (req, res, next) => {
  try { res.json(await repo.listGames(pool, req.squadId)) } catch (e) { next(e) }
})
app.post('/api/games/:id/vote', requireSquad, async (req, res, next) => {
  try { const rows = await repo.voteGame(pool, req.params.id, req.squadId); if (!rows) return res.status(404).json({ error: 'Game not found' }); res.json(rows) } catch (e) { next(e) }
})
app.get('/api/availability', requireSquad, async (req, res, next) => {
  try { res.json(await repo.getAvailability(pool, req.squadId)) } catch (e) { next(e) }
})
app.put('/api/availability', requireSquad, async (req, res, next) => {
  // The frontend sends the user's availability object directly as the request body.
  const mine = req.body
  if (!mine || typeof mine !== 'object' || Array.isArray(mine)) return fail(res, 'availability body must be an object')
  try { res.json(await repo.saveAvailability(pool, mine, req.squadId)) } catch (e) { next(e) }
})

app.use((_req, res) => res.status(404).json({ error: 'No such route' }))
app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(500).json({ error: 'Something went wrong on the server' })
})
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`SquadNight API listening on port ${port}`))
