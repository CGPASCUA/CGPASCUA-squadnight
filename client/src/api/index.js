// The only file components/pages import from.
//
// Swapping the simulated backend for the real Express API is one environment
// variable, set at BUILD time. Nothing in src/components or src/pages changes.
//
//   VITE_USE_MOCK_API=false  -> the real API at VITE_API_BASE_URL
//   anything else, INCLUDING UNSET -> the browser-only mock
//
// Demo mode is the DEFAULT, so a fresh clone of this repo builds into a
// working site before the backend is configured.

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
