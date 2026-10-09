import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createSession, getMySquad } from '../api/index.js'
import Card from '../components/Card.jsx'
import Button from '../components/Button.jsx'

const CATEGORIES = [
['FPS / Tactical', ['VALORANT','Counter-Strike 2','Overwatch 2','Rainbow Six Siege','Apex Legends','The Finals','Team Fortress 2','Paladins','Rogue Company','Spectre Divide']],
['MOBA / Strategy', ['League of Legends','Dota 2','Heroes of the Storm','Smite / Smite 2','Civilization VI','Age of Empires IV','Stellaris','Teamfight Tactics','StarCraft II','Warcraft III: Reforged']],
['Co-op / Action', ['Helldivers 2','Left 4 Dead 2','Warframe','Destiny 2','Deep Rock Galactic','Payday 3','Warhammer 40,000: Space Marine 2','Warhammer: Vermintide 2','Borderlands 3','Risk of Rain 2']],
['Survival / Sandbox', ['Valheim','Rust','Minecraft','Terraria','ARK: Survival Ascended','Palworld','Sea of Thieves','Project Zomboid','Sons of the Forest','Enshrouded']],
['Party / Casual / Other', ['Among Us','Lethal Company','Content Warning','Phasmophobia','Jackbox Party Pack','Rocket League','Pummel Party','Fall Guys','Dead by Daylight','Human Fall Flat']]
]

export default function Planner() {
  const navigate = useNavigate()
  const [squad, setSquad] = useState(null)
  const [game, setGame] = useState('')
  const [custom, setCustom] = useState('')
  const [search, setSearch] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [players, setPlayers] = useState([])
  const [notes, setNotes] = useState('')
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    getMySquad().then(s => { setSquad(s); setPlayers((s?.members || []).map(m => m.username)) })
      .catch(e => setError(e.message || 'Could not load squad members.'))
      .finally(() => setLoading(false))
  }, [])
  const allGames = useMemo(() => CATEGORIES.flatMap(c => c[1]), [])
  const chosen = game === '__custom__' ? custom.trim() : game
  const visible = CATEGORIES.map(([name, list]) => [name, list.filter(g => g.toLowerCase().includes(search.toLowerCase()))]).filter(([, list]) => list.length)
  function toggle(name) { setPlayers(old => old.includes(name) ? old.filter(p => p !== name) : [...old, name]) }
  async function submit(e) {
    e.preventDefault()
    if (!chosen) { setError('Choose a game first.'); setStep(1); return }
    if (!date || !time) { setError('Choose a date and time.'); return }
    setSaving(true); setError('')
    try {
      const created = await createSession({ game: chosen, date, time, players, notes, status: 'planned' })
      navigate(`/sessions/${created.id}`)
    } catch (err) { setError(err.message || 'Could not save the game night.') }
    finally { setSaving(false) }
  }
  if (loading) return <div className="container">Loading your squad…</div>
  return <div className="container">
    <div className="step-label">STEP {step} OF 2 — {step === 1 ? 'CHOOSE THE GAME' : 'PLAN GAME NIGHT'}</div>
    {error && <p className="error" role="alert">{error}</p>}
    {step === 1 ? <Card title="Choose a game" meta={`${allGames.length} games available`}>
      <input type="search" aria-label="Search games" placeholder="Search games…" value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom: 16 }} />
      {visible.map(([category, list]) => <section key={category} style={{ marginBottom: 18 }}>
        <h3 style={{ marginBottom: 8 }}>{category}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 8 }}>
          {list.map(name => <button type="button" key={name} aria-pressed={game === name} onClick={() => { setGame(name); setError('') }}
            style={{ textAlign: 'left', padding: '12px 14px', borderRadius: 12, border: game === name ? '1px solid #fbbf24' : '1px solid var(--color-border)', background: game === name ? 'rgba(251,191,36,.14)' : 'var(--color-card)', color: 'inherit', cursor: 'pointer' }}>
            {game === name ? '✓ ' : ''}{name}
          </button>)}
        </div>
      </section>)}
      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
        <label htmlFor="custom-game">Not listed? Enter another game</label>
        <input id="custom-game" placeholder="Custom game name" value={custom} onChange={e => { setCustom(e.target.value); if (e.target.value.trim()) setGame('__custom__') }} />
        {game === '__custom__' && custom.trim() && <p className="small">Selected: <strong>{custom.trim()}</strong></p>}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
        <Button variant="primary" onClick={() => { if (!chosen) return setError('Select a game or enter a custom title.'); setError(''); setStep(2) }}>Continue with {chosen || 'selected game'}</Button>
      </div>
    </Card> : <form onSubmit={submit}><Card title="Schedule game night" meta={`Selected game: ${chosen}`}>
      <p className="small">Selected game: <strong>{chosen}</strong></p>
      <label htmlFor="planner-date">Date</label><input id="planner-date" type="date" required value={date} onChange={e => setDate(e.target.value)} />
      <label htmlFor="planner-time">Time</label><input id="planner-time" type="time" required value={time} onChange={e => setTime(e.target.value)} />
      <label>Squad members joining</label>
      {squad?.members?.length ? <div style={{ display: 'grid', gap: 8, margin: '8px 0 16px' }}>{squad.members.map(m => <label key={m.id} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <input type="checkbox" style={{ width: 'auto' }} checked={players.includes(m.username)} onChange={() => toggle(m.username)} />{m.username}{m.role === 'owner' ? ' · Owner' : ''}
      </label>)}</div> : <p className="small">No squad members found; you can still schedule a game.</p>}
      <label htmlFor="planner-notes">Session note (optional)</label><textarea id="planner-notes" rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Anything the squad should know?" />
      <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
        <Button variant="primary" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Create Game Night'}</Button>
        <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
      </div>
    </Card></form>}
  </div>
}
