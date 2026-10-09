import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listSessions, listGames, voteGame, getMySquad, voteAttendance, getCurrentAccount } from '../api/index.js'
import Card from '../components/Card.jsx'
import Button from '../components/Button.jsx'
import PollOption from '../components/PollOption.jsx'
import DemoNotice from '../components/DemoNotice.jsx'

export default function Dashboard() {
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)
  const [sessions, setSessions] = useState([])
  const [games, setGames] = useState([])
  const [squad, setSquad] = useState(null)
  const [account, setAccount] = useState(null)

  async function load() {
    setStatus('loading')
    setError(null)
    try {
      const [sessionRows, gameRows, currentSquad, currentAccount] = await Promise.all([listSessions(), listGames(), getMySquad(), getCurrentAccount()])
      setSessions(sessionRows)
      setGames(gameRows)
      setSquad(currentSquad)
      setAccount(currentAccount.user)
      setStatus('ready')
    } catch (caught) {
      setError(caught)
      setStatus('error')
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function vote(id) { setGames(await voteGame(id)) }

  async function setAttendance(session, attending) {
  try {
    setError(null)

    await voteAttendance(session.id, attending)

    await load()
  } catch (err) {
    setError(err)
  }
}

  if (status === 'loading') return <div className="container">Loading…</div>
  if (status === 'error') {
    return (
      <div className="container">
        <p className="error" role="alert">{error.message} <button onClick={load}>Try again</button></p>
      </div>
    )
  }

  const totalVotes = games.reduce((sum, g) => sum + g.votes, 0)
  const upcoming = sessions.find((s) => s.status === 'planned')
  const recent = sessions.filter((s) => s.status === 'completed').slice(0, 3)

  return (
    <div className="container">
      <DemoNotice />
      <Card title={squad?.name || 'Squad Info'} meta={`${squad?.members?.length ?? 0} ${(squad?.members?.length ?? 0) === 1 ? 'member' : 'members'}`}>
        {squad ? <><p className="small">Invite code: <strong>{squad.joinCode}</strong></p><div style={{display:'flex',flexWrap:'wrap',gap:8}}>{(squad.members || []).map(m => <span key={m.id} className="small" style={{padding:'6px 10px',border:'1px solid var(--color-border)',borderRadius:999}}>{m.username}{m.role === 'owner' ? ' · Owner' : ''}</span>)}</div></> : <p className="small">You are not in a squad yet. <Link to="/squad">Find or create a squad</Link>.</p>}
      </Card>

        <div className="grid-2">
        {upcoming ? (
          <Card title="Upcoming Game Night" meta={`${upcoming.game} · ${upcoming.date} · ${upcoming.time}`}><p className="small">Will you join this game night?</p><div style={{display:'flex',gap:8,flexWrap:'wrap'}}><Button variant={upcoming.attendance?.[account?.username] === true ? 'primary' : 'ghost'} onClick={() => setAttendance(upcoming, true)}>I’ll attend</Button><Button variant={upcoming.attendance?.[account?.username] === false ? 'primary' : 'ghost'} onClick={() => setAttendance(upcoming, false)}>Can’t attend</Button><Link to={`/sessions/${upcoming.id}`}><Button variant="ghost">View Session</Button></Link></div><p className="small">Going: {Object.entries(upcoming.attendance || {}).filter(([,yes]) => yes === true).map(([name]) => name).filter(Boolean).filter((name, i, a) => a.indexOf(name) === i).join(', ') || 'No votes yet'}</p></Card>
        ) : (
          <Card title="Upcoming Game Night" meta="Nothing planned yet">
            <Link to="/planner"><Button variant="primary">Plan Game Night</Button></Link>
          </Card>
        )}

        <Card title="Current Game Poll">
          {games.map((g) => (
            <PollOption key={g.id} label={g.label} votes={g.votes} totalVotes={totalVotes} onVote={() => vote(g.id)} />
          ))}
          <Link to="/planner"><Button variant="ghost">Go to Planner</Button></Link>
        </Card>
      </div>

      <div className="grid-2">
        <Card title="Availability Summary" meta={`${squad?.members?.length ?? 0} squad members`}>
          <Link to="/availability"><Button variant="primary">Set Availability</Button></Link>
        </Card>
        <Card title="Suggested Schedule" meta="Best overlap: Fri 8:00 PM">
          <Link to="/planner"><Button variant="accent">Plan Game Night</Button></Link>
        </Card>
      </div>

      <Card title="Recent Completed Sessions">
        {recent.length === 0 && <p className="small">No completed sessions yet.</p>}
        {recent.map((s) => (
          <div key={s.id} className="small" style={{ marginBottom: 6 }}>
            {s.game} — {s.date} — {s.report?.result}
          </div>
        ))}
        <Link to="/history"><Button variant="ghost">View History</Button></Link>
      </Card>
    </div>
  )
}
