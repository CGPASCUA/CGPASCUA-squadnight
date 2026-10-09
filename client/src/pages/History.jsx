import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listSessions, deleteSession, getCurrentAccount } from '../api/index.js'
import Card from '../components/Card.jsx'

export default function History() {
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)
  const [sessions, setSessions] = useState([])
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState(null)
  const [account, setAccount] = useState(null)

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

  useEffect(() => { load(); getCurrentAccount().then(result => setAccount(result.user)).catch(() => {}) }, [])

  if (status === 'loading') return <div className="container">Loading…</div>
  if (status === 'error') {
    return (
      <div className="container">
        <p className="error" role="alert">{error.message} <button onClick={load}>Try again</button></p>
      </div>
    )
  }

  async function remove(id) { if (!window.confirm('Delete this session from history? This cannot be undone.')) return; setDeleting(id); try { await deleteSession(id); setSessions(rows => rows.filter(row => String(row.id) !== String(id))) } catch (e) { setError(e); setStatus('error') } finally { setDeleting(null) } }

  const completed = sessions.filter((s) => s.status === 'completed')
  const filtered = completed.filter((s) => s.game.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="container">
      <h2>Session History</h2>
      <input placeholder="Search by game…" value={search} onChange={(e) => setSearch(e.target.value)} />
      {filtered.length === 0 && <p className="small">No completed sessions yet.</p>}
      <div className="grid-3">
        {filtered.map((s) => (
          <Card key={s.id} title={s.game} meta={`${s.date} · ${s.report?.result} · ${'★'.repeat(Number(s.report?.rating) || 0)}`}>
            <div style={{display:'flex',gap:12,alignItems:'center'}}><Link to={`/sessions/${s.id}`}>View Session</Link>{s.creator_user_id === account?.id && <button type="button" onClick={() => remove(s.id)} disabled={deleting === s.id}>{deleting === s.id ? 'Deleting…' : 'Delete'}</button>}</div>
          </Card>
        ))}
      </div>
    </div>
  )
}
