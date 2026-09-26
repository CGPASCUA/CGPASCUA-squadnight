// The real client. Every function here talks to YOUR Express API once it
// exists (see server/). mockApi.js exists so the interface can be built
// before the API has anywhere to point.

const BASE = import.meta.env.VITE_API_BASE_URL || ''

async function request(path, options) {
  const response = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!response.ok) {
    let message = `${response.status} ${response.statusText}`
    try {
      const body = await response.json()
      if (body?.error) message = body.error
    } catch {
      // The body was not JSON. The status line is all we have.
    }
    throw new Error(message)
  }

  return response.status === 204 ? null : response.json()
}

// ---------------- Sessions ----------------
export const listSessions = () => request('/api/sessions')
export const getSession = (id) => request(`/api/sessions/${id}`)
export const createSession = (input) =>
  request('/api/sessions', { method: 'POST', body: JSON.stringify(input) })
export const updateSession = (id, patch) =>
  request(`/api/sessions/${id}`, { method: 'PATCH', body: JSON.stringify(patch) })

// ---------------- Game poll ----------------
export const listGames = () => request('/api/games')
export const voteGame = (id) => request(`/api/games/${id}/vote`, { method: 'POST' })

// ---------------- Availability ----------------
export const getAvailability = () => request('/api/availability')
export const saveAvailability = (mine) =>
  request('/api/availability', { method: 'PUT', body: JSON.stringify(mine) })
