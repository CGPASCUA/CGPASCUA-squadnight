import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, PlusCircle, Copy, ArrowLeft, LogOut, RefreshCw } from 'lucide-react'
import Card from '../components/Card.jsx'
import Button from '../components/Button.jsx'
import Logo from '../components/Logo.jsx'
import { createSquad, getMySquad, joinSquad, leaveSquad } from '../api/index.js'

export default function SquadSetup() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('choose')
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [squad, setSquad] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function refreshSquad() {
    setLoading(true)
    try { setSquad(await getMySquad()); setError('') }
    catch (err) { setError(err.message || 'Could not load your squad.') }
    finally { setLoading(false) }
  }
  useEffect(() => { refreshSquad() }, [])

  async function submit(event) {
    event.preventDefault(); setError(''); setBusy(true)
    try {
      const result = mode === 'create' ? await createSquad(name) : await joinSquad(code)
      setSquad(result); setMode('choose')
    } catch (err) { setError(err.message || 'Could not save your squad. Please try again.') }
    finally { setBusy(false) }
  }

  async function switchSquad() {
    if (!window.confirm('Leave your current squad? You will need a new invite code to join another squad.')) return
    setBusy(true); setError('')
    try { await leaveSquad(); setSquad(null); setMode('choose') }
    catch (err) { setError(err.message || 'Could not leave this squad.') }
    finally { setBusy(false) }
  }

  if (loading) return <div className="join-page"><div className="join-card-wrap"><p>Loading your squad…</p></div></div>

  return <div className="join-page"><div className="join-card-wrap">
    <div className="join-brand"><Logo size={56}/><h1>{squad ? 'Your squad' : mode === 'create' ? 'Create a squad' : mode === 'join' ? 'Join a squad' : 'Find your squad'}</h1><p className="small">Squad membership is saved to your account in the database.</p></div>
    {squad ? <Card>
      <h2>{squad.name}</h2>
      <p className="small">{squad.members?.length ?? 0} {(squad.members?.length ?? 0) === 1 ? 'member' : 'members'} · {squad.role === 'owner' ? 'Owner' : 'Member'}</p>
      <div style={{fontSize:26,fontWeight:800,letterSpacing:4,textAlign:'center',padding:14}}>{squad.joinCode}</div>
      <Button type="button" variant="accent" onClick={() => navigator.clipboard?.writeText(squad.joinCode)}><Copy size={16}/> Copy invite code</Button>
      <h3 style={{marginTop:22}}><Users size={18} style={{verticalAlign:'middle',marginRight:8}}/>Members</h3>
      <div style={{display:'grid',gap:10}}>{(squad.members || []).map(member => <div key={member.id} style={{display:'flex',justifyContent:'space-between',gap:12,padding:'10px 12px',border:'1px solid var(--color-border)',borderRadius:10}}><span>{member.username}{member.id === localStorage.getItem('squadnight_userId') ? ' (you)' : ''}</span><span className="small">{member.role === 'owner' ? 'Owner' : 'Member'}</span></div>)}</div>
      <div style={{height:14}}/><Button type="button" onClick={() => navigate('/dashboard',{replace:true})}>Go to dashboard</Button>
      <div style={{height:10}}/><Button type="button" variant="ghost" disabled={busy} onClick={switchSquad}><RefreshCw size={15}/> Leave squad to join another</Button>
      {error && <p role="alert" className="small" style={{color:'#f87171'}}>{error}</p>}
    </Card> : mode === 'choose' ? <div style={{display:'grid',gap:12}}>
      <Card><div style={{display:'flex',gap:12,alignItems:'center',marginBottom:12}}><PlusCircle/><div><h2 style={{margin:0}}>Create a squad</h2><p className="small">You will be its first and only member.</p></div></div><Button type="button" variant="accent" onClick={() => {setError('');setMode('create')}}>Create a squad</Button></Card>
      <Card><div style={{display:'flex',gap:12,alignItems:'center',marginBottom:12}}><Users/><div><h2 style={{margin:0}}>Join a squad</h2><p className="small">Use an invite code from a friend.</p></div></div><Button type="button" onClick={() => {setError('');setMode('join')}}>Join with a code</Button></Card>
      <button className="small" style={{background:'none',border:0,cursor:'pointer'}} onClick={() => navigate('/dashboard')}>Back to dashboard</button>
    </div> : <Card><form onSubmit={submit}>{mode === 'create' ? <><label htmlFor="squad-name">Squad name</label><input id="squad-name" value={name} onChange={e=>setName(e.target.value)} minLength={2} maxLength={60} placeholder="e.g. Friday Night Crew" required /></> : <><label htmlFor="squad-code">Squad invite code</label><input id="squad-code" value={code} onChange={e=>setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,8))} minLength={8} maxLength={8} placeholder="8-character code" required /></>}{error && <div role="alert" className="small" style={{color:'#f87171',marginBottom:12}}>{error}</div>}<Button type="submit" variant="accent" disabled={busy}>{busy ? 'Please wait…' : mode === 'create' ? 'Create squad' : 'Join squad'}</Button></form><button className="small" style={{marginTop:14,background:'none',border:0,cursor:'pointer'}} onClick={()=>{setError('');setMode('choose')}}><ArrowLeft size={14}/> Back</button></Card>}
  </div></div>
}
