import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card.jsx'
import Button from '../components/Button.jsx'

// No real backend account system yet, so "joining" just means: type a name +
// squad code, remember them in localStorage, and go to the Dashboard. Once
// there's a real squads table, this is where you'd POST { username, squadCode }
// and check whether that code is real.
export default function Join() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [squadCode, setSquadCode] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!username.trim() || !squadCode.trim()) {
      setError('Please enter both your name and a squad code.')
      return
    }
    localStorage.setItem('squadnight_username', username.trim())
    localStorage.setItem('squadnight_squadCode', squadCode.trim().toUpperCase())
    navigate('/dashboard')
  }

  return (
    <div className="container" style={{ maxWidth: 420, marginTop: 60 }}>
      <h1 style={{ textAlign: 'center' }}>SquadNight</h1>
      <Card title="Join Your Squad" meta="No password needed — just your name and a squad code.">
        <form onSubmit={handleSubmit}>
          <label>Your Name</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. MikMik" />
          <label>Squad Code</label>
          <input value={squadCode} onChange={(e) => setSquadCode(e.target.value)} placeholder="e.g. SQUAD-4XJ2" />
          {error && (
            <div className="small" style={{ color: '#f87171', marginBottom: 12 }}>
              {error}
            </div>
          )}
          <Button type="submit" variant="accent">
            Join Squad
          </Button>
        </form>
      </Card>
      <div className="small" style={{ textAlign: 'center' }}>
        Don't have a squad code? Ask whoever created your squad to share it with you.
      </div>
    </div>
  )
}
