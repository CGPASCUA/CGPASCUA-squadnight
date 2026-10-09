import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card.jsx'
import Button from '../components/Button.jsx'
import Logo from '../components/Logo.jsx'

function randomSquadCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return `SQUAD-${code}`
}

export default function Join() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('join')
  const [username, setUsername] = useState('')
  const [squadCode, setSquadCode] = useState('')
  const [createdCode, setCreatedCode] = useState('')
  const [error, setError] = useState('')

  function enterApp(name, code) {
    localStorage.setItem('squadnight_username', name)
    localStorage.setItem('squadnight_squadCode', code)
    navigate('/dashboard')
  }

  function handleJoin(e) {
    e.preventDefault()
    if (!username.trim() || !squadCode.trim()) {
      setError('Please enter both your name and a squad code.')
      return
    }
    enterApp(username.trim(), squadCode.trim().toUpperCase())
  }

  function handleCreate(e) {
    e.preventDefault()
    if (!username.trim()) {
      setError('Please enter your name first.')
      return
    }
    setCreatedCode(randomSquadCode())
  }

  function switchMode(next) {
    setMode(next)
    setError('')
    setCreatedCode('')
  }

  return (
    <div className="join-page">
      <div className="join-card-wrap">
        <div className="join-brand">
          <Logo size={56} />
          <h1>SquadNight</h1>
          <p className="small">Plan your squad's next game night.</p>
        </div>

        <div className="join-tabs">
          <button className={`join-tab ${mode === 'join' ? 'active' : ''}`} onClick={() => switchMode('join')} type="button">
            Join Squad
          </button>
          <button className={`join-tab ${mode === 'create' ? 'active' : ''}`} onClick={() => switchMode('create')} type="button">
            Create Squad
          </button>
        </div>

        <Card>
          {mode === 'join' && (
            <form onSubmit={handleJoin}>
              <label>Your Name</label>
              <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. MikMik" />
              <label>Squad Code</label>
              <input value={squadCode} onChange={(e) => setSquadCode(e.target.value)} placeholder="e.g. SQUAD-4XJ2" />
              {error && <div className="small" style={{ color: '#f87171', marginBottom: 12 }}>{error}</div>}
              <Button type="submit" variant="accent">Join Squad</Button>
              <div className="small" style={{ marginTop: 10 }}>
                Don't have a code? Ask whoever created your squad, or switch to "Create Squad" to start your own.
              </div>
            </form>
          )}

          {mode === 'create' && !createdCode && (
            <form onSubmit={handleCreate}>
              <label>Your Name</label>
              <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. MikMik" />
              {error && <div className="small" style={{ color: '#f87171', marginBottom: 12 }}>{error}</div>}
              <Button type="submit" variant="primary">Create Squad</Button>
              <div className="small" style={{ marginTop: 10 }}>
                We'll generate a squad code you can share with your friends.
              </div>
            </form>
          )}

          {mode === 'create' && createdCode && (
            <div>
              <label>Your squad code</label>
              <div className="squad-code-display">{createdCode}</div>
              <div className="small" style={{ marginBottom: 16 }}>
                Share this with your squad so they can join with "Join Squad". You can find it again later in the header.
              </div>
              <Button variant="accent" onClick={() => enterApp(username.trim(), createdCode)}>
                Continue to Dashboard
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
