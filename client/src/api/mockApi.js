import seed from './seed.json'

const SESSIONS_KEY = 'squadnight:sessions'
const GAMES_KEY = 'squadnight:games'
const AVAILABILITY_KEY = 'squadnight:availability'

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms))

function readJSON(key, fallback) {
  const stored = localStorage.getItem(key)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      localStorage.removeItem(key)
    }
  }
  localStorage.setItem(key, JSON.stringify(fallback))
  return fallback
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
  return value
}

export async function listSessions() {
  await delay()
  return readJSON(SESSIONS_KEY, seed.sessions)
}

export async function getSession(id) {
  await delay()
  const found = readJSON(SESSIONS_KEY, seed.sessions).find(
    (row) => String(row.id) === String(id)
  )
  if (!found) throw new Error('Session not found')
  return found
}

export async function createSession(input) {
  await delay()
  const rows = readJSON(SESSIONS_KEY, seed.sessions)
  const created = {
    id: crypto.randomUUID(),
    status: 'planned',
    report: null,
    ...input,
  }
  writeJSON(SESSIONS_KEY, [created, ...rows])
  return created
}

export async function updateSession(id, patch) {
  await delay()
  const rows = readJSON(SESSIONS_KEY, seed.sessions)
  const index = rows.findIndex((row) => String(row.id) === String(id))
  if (index === -1) throw new Error('Session not found')
  rows[index] = { ...rows[index], ...patch }
  writeJSON(SESSIONS_KEY, rows)
  return rows[index]
}

export async function listGames() {
  await delay()
  return readJSON(GAMES_KEY, seed.games)
}

export async function voteGame(id) {
  await delay()
  const rows = readJSON(GAMES_KEY, seed.games)
  const updated = rows.map((g) => (g.id === id ? { ...g, votes: g.votes + 1 } : g))
  writeJSON(GAMES_KEY, updated)
  return updated
}

export async function getAvailability() {
  await delay()
  return readJSON(AVAILABILITY_KEY, seed.availability)
}

export async function saveAvailability(mine) {
  await delay()
  const current = readJSON(AVAILABILITY_KEY, seed.availability)
  const updated = { ...current, mine }
  writeJSON(AVAILABILITY_KEY, updated)
  return updated
}
