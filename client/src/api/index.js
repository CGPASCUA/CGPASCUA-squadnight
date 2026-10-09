import * as mockApi from './mockApi.js'
import * as httpApi from './httpApi.js'

export const USING_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false'

const implementation = USING_MOCK_API ? mockApi : httpApi

export const {
  listSessions,
  getSession,
  createSession,
  updateSession,
  listGames,
  voteGame,
  getAvailability,
  saveAvailability,
} = implementation

// Authentication always uses the real API; account credentials are never mocked.
export const { registerAccount, loginAccount, logoutAccount, getCurrentAccount } = httpApi

// Squad creation and membership must always use the real backend.
export const { getMySquad, createSquad, joinSquad } = httpApi
