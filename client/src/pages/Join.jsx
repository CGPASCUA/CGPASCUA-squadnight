import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card.jsx'
import Button from '../components/Button.jsx'
import Logo from '../components/Logo.jsx'
import { registerAccount, loginAccount } from '../api/index.js'

export default function Join() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setError('')
    if (!username.trim()) return setError('Please enter your username.')
    if (!/^\d{4}$/.test(pin)) return setError('Your passcode must be exactly 4 numbers.')
    if (mode === 'register' && pin !== confirmPin) return setError('The passcodes do not match.')
    setBusy(true)
    try {
      const session = mode === 'register'
        ? await registerAccount(username.trim(), pin)
        : await loginAccount(username.trim(), pin)
      localStorage.setItem('squadnight_token', session.token)
      localStorage.setItem('squadnight_username', session.user.username)
      localStorage.setItem('squadnight_userId', session.user.id)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Could not connect. Please try again.')
    } finally { setBusy(false) }
  }

  function switchMode(next) {
    setMode(next); setError(''); setPin(''); setConfirmPin('')
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
          <button className={`join-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => switchMode('login')} type="button">Log In</button>
          <button className={`join-tab ${mode === 'register' ? 'active' : ''}`} onClick={() => switchMode('register')} type="button">Create Account</button>
        </div>
        <Card>
          <form onSubmit={submit}>
            <label htmlFor="account-username">Username</label>
            <input id="account-username" value={username} onChange={e => setUsername(e.target.value)} placeholder="Choose your username" autoComplete="username" maxLength={40} required />
            <label htmlFor="account-pin">4-digit passcode</label>
            <input id="account-pin" type="password" inputMode="numeric" pattern="[0-9]{4}" maxLength={4} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="••••" aria-describedby="pin-help" required />
            <div id="pin-help" className="small" style={{ marginTop: -6, marginBottom: 12 }}>Numbers only. Keep it private.</div>
            {mode === 'register' && <>
              <label htmlFor="account-confirm-pin">Confirm passcode</label>
              <input id="account-confirm-pin" type="password" inputMode="numeric" pattern="[0-9]{4}" maxLength={4} autoComplete="new-password" value={confirmPin} onChange={e => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="Re-enter your 4 digits" required />
            </>}
            {error && <div role="alert" className="small" style={{ color: '#f87171', marginBottom: 12 }}>{error}</div>}
            <Button type="submit" variant="accent" disabled={busy}>{busy ? 'Please wait…' : mode === 'register' ? 'Create Account' : 'Log In'}</Button>
            <div className="small" style={{ marginTop: 12 }}>
              {mode === 'register' ? 'Your account is saved in the database. Your passcode is stored securely as a hash.' : "New to SquadNight? Create an account first."}
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
