import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listGames, voteGame, createSession } from '../api/index.js'
import Card from '../components/Card.jsx'
import Button from '../components/Button.jsx'
import PollOption from '../components/PollOption.jsx'

const allMembers = ['You', 'Member A', 'Member B', 'Member C', 'Member D']

export default function Planner() {
  const navigate = useNavigate()

  const [status, setStatus] = useState('loading') // loading | ready | error
  const [error, setError] = useState(null)
  const [games, setGames] = useState([])
  const [finalGame, setFinalGame] = useState(null)

  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [players, setPlayers] = useState([])
  const [note, setNote] = useState('')

  async function load() {
    setStatus('loading')
    setError(null)
    try {
      setGames(await listGames())
      setStatus('ready')
    } catch (caught) {
      setError(caught)
      setStatus('error')
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function vote(id) {
    setGames(await voteGame(id))
  }

  function lockInGame() {
    const leading = [...games].sort((a, b) => b.votes - a.votes)[0]
    setFinalGame(leading)
  }

  function togglePlayer(name) {
    setPlayers((prev) => (prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]))
  }

  async function finalizeGameNight() {
    const created = await createSession({
      game: finalGame.label,
      date,
      time,
      players,
      notes: note,
    })
    navigate(`/sessions/${created.id}`)
  }

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

  const totalVotes = games.reduce((sum, g) => sum + g.votes, 0)

  return (
    <div className="container">
      <div className="step-label">Step 1 of 2 — Choose the Game</div>
      <Card>
        {games.map((g) => (
          <PollOption
            key={g.id}
            label={g.label}
            votes={g.votes}
            totalVotes={totalVotes}
            onVote={() => vote(g.id)}
          />
        ))}
        {finalGame ? (
          <div className="small">Locked in: {finalGame.label}</div>
        ) : (
          <Button variant="primary" onClick={lockInGame}>
            Lock in Final Game
          </Button>
        )}
      </Card>

      {finalGame && (
        <>
          <div className="step-label">Step 2 of 2 — Create the Schedule</div>
          <Card>
            <div className="small" style={{ marginBottom: 8 }}>
              Selected Game: {finalGame.label}
            </div>
            <label>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <label>Time</label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            <label>Players</label>
            {allMembers.map((m) => (
              <label key={m} style={{ display: 'inline-block', marginRight: 12 }}>
                <input
                  type="checkbox"
                  style={{ width: 'auto', marginRight: 4 }}
                  checked={players.includes(m)}
                  onChange={() => togglePlayer(m)}
                />
                {m}
              </label>
            ))}
            <label style={{ marginTop: 12 }}>Session Note (optional)</label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} />
            <Button variant="accent" onClick={finalizeGameNight}>
              Create / Finalize Game Night
            </Button>
          </Card>
        </>
      )}
    </div>
  )
}
