import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, PlusCircle, LogIn, Copy, ArrowLeft } from 'lucide-react'
import Card from '../components/Card.jsx'
import Button from '../components/Button.jsx'
import Logo from '../components/Logo.jsx'
import { createSquad, getMySquad, joinSquad } from '../api/index.js'

export default function SquadSetup() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('choose')
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [squad, setSquad] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    getMySquad().then(existing => { if (existing) navigate('/dashboard', { replace: true }) }).catch(err => setError(err.message))
  }, [navigate])

  async function submit(event) {
    event.preventDefault(); setError(''); setBusy(true)
    try {
      const result = mode === 'create' ? await createSquad(name) : await joinSquad(code)
      setSquad(result)
      if (mode === 'create') setMode('created')
      else navigate('/dashboard', { replace: true })
    } catch (err) { setError(err.message || 'Could not save your squad. Please try again.') }
    finally { setBusy(false) }
  }

  if (mode === 'created' && squad) return <div className="join-page"><div className="join-card-wrap"><div className="join-brand"><Logo size={56}/><h1>Squad created!</h1><p className="small">You're the owner and the first member. Nobody else has been added.</p></div><Card><h2>{squad.name}</h2><p className="small">Share this code with friends so they can join your squad.</p><div style={{fontSize:28,fontWeight:800,letterSpacing:5,textAlign:'center',padding:16}}>{squad.joinCode}</div><Button type="button" variant="accent" onClick={() => navigator.clipboard?.writeText(squad.joinCode)}><Copy size={16}/> Copy squad code</Button><div style={{height:12}}/><Button type="button" onClick={() => navigate('/dashboard',{replace:true})}>Go to squad dashboard</Button></Card></div></div>

  return <div className="join-page"><div className="join-card-wrap"><div className="join-brand"><Logo size={56}/><h1>{mode === 'choose' ? 'Find your squad' : mode === 'create' ? 'Create a squad' : 'Join a squad'}</h1><p className="small">{mode === 'choose' ? 'You’re signed in! Create a new squad or join one with a code.' : mode === 'create' ? 'Your squad starts with you as its only member.' : 'Enter the code shared by your squad owner.'}</p></div>
    {mode === 'choose' ? <div style={{display:'grid',gap:12}}><Card><div style={{display:'flex',gap:12,alignItems:'center',marginBottom:12}}><PlusCircle/><div><h2 style={{margin:0}}>Create a squad</h2><p className="small">Start a new squad and invite friends.</p></div></div><Button type="button" variant="accent" onClick={() => {setError('');setMode('create')}}>Create a squad</Button></Card><Card><div style={{display:'flex',gap:12,alignItems:'center',marginBottom:12}}><Users/><div><h2 style={{margin:0}}>Join a squad</h2><p className="small">Already have a squad code?</p></div></div><Button type="button" onClick={() => {setError('');setMode('join')}}>Join with a code</Button></Card><button className="small" style={{background:'none',border:0,cursor:'pointer'}} onClick={() => {localStorage.removeItem('squadnight_token');localStorage.removeItem('squadnight_username');localStorage.removeItem('squadnight_userId');navigate('/join',{replace:true})}}><ArrowLeft size={14}/> Log out</button></div> : <Card><form onSubmit={submit}>{mode === 'create' ? <><label htmlFor="squad-name">Squad name</label><input id="squad-name" value={name} onChange={e=>setName(e.target.value)} minLength={2} maxLength={60} placeholder="e.g. Friday Night Crew" required /></> : <><label htmlFor="squad-code">Squad code</label><input id="squad-code" value={code} onChange={e=>setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,8))} minLength={8} maxLength={8} placeholder="8-character code" required /></>}{error && <div role="alert" className="small" style={{color:'#f87171',marginBottom:12}}>{error}</div>}<Button type="submit" variant="accent" disabled={busy}>{busy ? 'Please wait…' : mode === 'create' ? 'Create squad' : 'Join squad'}</Button></form><button className="small" style={{marginTop:14,background:'none',border:0,cursor:'pointer'}} onClick={()=>{setError('');setMode('choose')}}>← Back</button></Card>}</div></div>
}
