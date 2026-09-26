import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listSessions } from '../api/index.js'
import Card from '../components/Card.jsx'

export default function History() {
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [error, setError] = useState(null)
  const [sessions, setSessions] = useState([])
  const [search, setSearch] = useState('')

  async function load() {
    setStatus('loading')
    setError(null)
    try {
      setSessions(await listSessions())
      setStatus('ready')
    } catch (caught) {
      setError(caught)
      setStatus('error')
    }
  }

  useEffect(() => {
    load()
  }, [])

  if (status === 'loading') return <div className="container">Loading…</div>

  if (status === 'error') {
    return (
      <div className="container">
        <p className="error" role="alert">
          {error.message} <button onClick={load}>Try again</button>
        </p>
      </div>
    )
  }

  const completed = sessions.filter((s) => s.status === 'completed')
  const filtered = completed.filter((s) => s.game.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="container">
      <h2>Session History</h2>
      <input placeholder="Search by game…" value={search} onChange={(e) => setSearch(e.target.value)} />

      {filtered.length === 0 && <p className="small">No completed sessions yet.</p>}

      <div className="grid-3">
        {filtered.map((s) => (
          <Card
            key={s.id}
            title={s.game}
            meta={`${s.date} · ${s.report?.result} · ${'★'.repeat(Number(s.report?.rating) || 0)}`}
          >
            <Link to={`/sessions/${s.id}`}>View Session</Link>
          </Card>
        ))}
      </div>
    </div>
  )
}
