const BASE = import.meta.env.VITE_API_BASE_URL || ''

async function request(path, options) {
  const response = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(localStorage.getItem('squadnight_token') ? { Authorization: `Bearer ${localStorage.getItem('squadnight_token')}` } : {}),
    },
    ...options,
  })

  if (!response.ok) {
    let message = `${response.status} ${response.statusText}`
    try {
      const body = await response.json()
      if (body?.error) message = body.error
    } catch {
      // not JSON
    }
    throw new Error(message)
  }

  return response.status === 204 ? null : response.json()
}

export const listSessions = () => request('/api/sessions')
export const getSession = (id) => request(`/api/sessions/${id}`)
export const createSession = (input) =>
  request('/api/sessions', { method: 'POST', body: JSON.stringify(input) })
export const updateSession = (id, patch) =>
  request(`/api/sessions/${id}`, { method: 'PATCH', body: JSON.stringify(patch) })

export const listGames = () => request('/api/games')
export const voteGame = (id) => request(`/api/games/${id}/vote`, { method: 'POST' })

export const getAvailability = () => request('/api/availability')
export const saveAvailability = (mine) =>
  request('/api/availability', { method: 'PUT', body: JSON.stringify(mine) })

export const registerAccount = (username, pin) =>
  request('/api/auth/register', { method: 'POST', body: JSON.stringify({ username, pin }) })
export const loginAccount = (username, pin) =>
  request('/api/auth/login', { method: 'POST', body: JSON.stringify({ username, pin }) })
export const logoutAccount = () =>
  request('/api/auth/logout', { method: 'POST' })
export const getCurrentAccount = () => request('/api/auth/me')
