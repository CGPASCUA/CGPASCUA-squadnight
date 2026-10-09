import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getSession, updateSession } from '../api/index.js'
import Card from '../components/Card.jsx'
import Button from '../components/Button.jsx'
import MemberBadge from '../components/MemberBadge.jsx'

export default function SessionDetails() {
  const { id } = useParams()
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)
  const [session, setSession] = useState(null)
  const [reporting, setReporting] = useState(false)
  const [report, setReport] = useState({ result: '', score: '', rating: 0, note: '' })

  async function load() {
    setStatus('loading')
    setError(null)
    try {
      setSession(await getSession(id))
      setStatus('ready')
    } catch (caught) {
      setError(caught)
      setStatus('error')
    }
  }

  useEffect(() => { load() }, [id])

  async function markCompleted(patch) { setSession(await updateSession(id, patch)) }

  async function submitReport(e) {
    e.preventDefault()
    await markCompleted({ status: 'completed', report })
    setReporting(false)
  }

  if (status === 'loading') return <div className="container">Loading…</div>
  if (status === 'error') {
    return (
      <div className="container">
        <p className="error" role="alert">{error.message} <button onClick={load}>Try again</button></p>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="small" style={{ marginBottom: 8 }}>
        <Link to="/dashboard">← Back to Dashboard</Link> &nbsp;|&nbsp; <Link to="/history">← Back to History</Link>
      </div>

      <Card title={`Game-Night Summary — Status: ${session.status.toUpperCase()}`} meta={`Game: ${session.game}   Date: ${session.date}   Time: ${session.time}`}>
        <div className="badge-row" style={{ marginBottom: 8 }}>
          {session.players.map((p) => <MemberBadge key={p} initials={p} />)}
        </div>
        {session.notes && <div className="small">Notes: "{session.notes}"</div>}
      </Card>

      {session.status === 'planned' && !reporting && (
        <Card>
          <Button variant="primary" style={{ marginRight: 8 }}>Notify Discord</Button>
          <Button variant="ghost" style={{ marginRight: 8 }}>Edit Plan</Button>
          <Button variant="accent" onClick={() => setReporting(true)}>Mark as Completed</Button>
        </Card>
      )}

      {reporting && (
        <Card title="Post-Game Session Report">
          <form onSubmit={submitReport}>
            <label>Result</label>
            <select value={report.result} onChange={(e) => setReport({ ...report, result: e.target.value })}>
              <option value="">Select…</option>
              <option>Win</option><option>Loss</option><option>Draw</option><option>No Result</option>
            </select>
            <label>Score</label>
            <input value={report.score} onChange={(e) => setReport({ ...report, score: e.target.value })} />
            <label>Rating (1–5)</label>
            <input type="number" min="1" max="5" value={report.rating} onChange={(e) => setReport({ ...report, rating: e.target.value })} />
            <label>Screenshot</label>
            <input type="file" accept="image/*" />
            <label>Memory / Notes</label>
            <textarea rows={3} value={report.note} onChange={(e) => setReport({ ...report, note: e.target.value })} />
            <Button type="submit" variant="accent">Submit Report</Button>
          </form>
        </Card>
      )}

      {session.status === 'completed' && session.report && (
        <Card title="Post-Game Report" meta={`Result: ${session.report.result}   Score: ${session.report.score}`}>
          <div className="small">Rating: {'★'.repeat(Number(session.report.rating) || 0)}</div>
          {session.report.note && <div className="small">Note: "{session.report.note}"</div>}
          <Button variant="primary" style={{ marginTop: 8 }}>Notify Discord</Button>
        </Card>
      )}
    </div>
  )
}
