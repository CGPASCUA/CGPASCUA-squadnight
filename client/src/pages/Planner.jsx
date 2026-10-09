import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createSession } from '../api/index.js'
import Card from '../components/Card.jsx'
import Button from '../components/Button.jsx'

const groups = {
  'FPS & Tactical': ['VALORANT','Counter-Strike 2','Overwatch 2','Rainbow Six Siege','Apex Legends','The Finals','Team Fortress 2','Paladins','Rogue Company','Spectre Divide'],
  'MOBA & Strategy': ['League of Legends','Dota 2','Heroes of the Storm','Smite / Smite 2','Civilization VI','Age of Empires IV','Stellaris','Teamfight Tactics','StarCraft II','Warcraft III: Reforged'],
  'Co-op & Action': ['Helldivers 2','Left 4 Dead 2','Warframe','Destiny 2','Deep Rock Galactic','Payday 3','Warhammer 40,000: Space Marine 2','Warhammer: Vermintide 2','Borderlands 3','Risk of Rain 2'],
  'Survival & Sandbox': ['Valheim','Rust','Minecraft','Terraria','ARK: Survival Ascended','Palworld','Sea of Thieves','Project Zomboid','Sons of the Forest','Enshrouded'],
  'Party & Casual': ['Among Us','Lethal Company','Content Warning','Phasmophobia','Jackbox Party Pack','Rocket League','Pummel Party','Fall Guys','Dead by Daylight','Human Fall Flat'],
}
const games = Object.entries(groups).flatMap(([category, names]) => names.map((name) => ({ name, category })))

export default function Planner() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState('')
  const [customMode, setCustomMode] = useState(false)
  const [custom, setCustom] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const filtered = useMemo(() => games.filter((g) => g.name.toLowerCase().includes(query.toLowerCase())), [query])
  const game = customMode ? custom.trim() : selected
  async function submit(e) {
    e.preventDefault(); setError('')
    if (!game) { setError('Choose a game or enter a custom game title.'); return }
    if (!date || !time) { setError('Choose a date and time for your game night.'); return }
    setSaving(true)
    try { const created = await createSession({ game, date, time, players: [], notes: note.trim() }); navigate(`/sessions/${created.id}`) }
    catch (caught) { setError(caught?.message || 'Could not create the game night. Please try again.') }
    finally { setSaving(false) }
  }
  return <main className="container page-shell planner-page">
    <div className="page-heading"><span className="eyebrow">MAKE IT A SQUAD NIGHT</span><h1>Plan your next game night</h1><p className="small">Pick a game, set a time, and get the squad together.</p></div>
    <form onSubmit={submit}>
      <Card title="01 · Choose your game" meta="50 games ready to play">
        <div className="game-search"><input aria-label="Search games" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search all 50 games…" /><span className="small">{filtered.length} results</span></div>
        <div className="game-groups">{Object.keys(groups).map((category) => {
          const items = filtered.filter((g) => g.category === category)
          if (!items.length) return null
          return <section className="game-group" key={category}><h3>{category}</h3><div className="game-choice-grid">{items.map(({ name }) => <button key={name} type="button" className={`game-choice ${!customMode && selected === name ? 'selected' : ''}`} onClick={() => { setSelected(name); setCustomMode(false); setError('') }} aria-pressed={!customMode && selected === name}><span className="game-choice-icon">🎮</span><span>{name}</span>{selected === name && !customMode && <span className="game-check">✓</span>}</button>)}</div></section>
        })}</div>
        {!filtered.length && <p className="small">No games match that search. Try another title or add a custom game below.</p>}
        <div className={`custom-game ${customMode ? 'selected' : ''}`}><label className="custom-game-toggle"><input type="checkbox" checked={customMode} onChange={(e) => { setCustomMode(e.target.checked); if (e.target.checked) setSelected('') }} /> My game isn't listed</label>{customMode && <input autoFocus value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="Enter game title" aria-label="Custom game title" />}</div>
      </Card>
      <Card title="02 · Set the schedule" meta={game ? `Selected: ${game}` : 'Choose a game above to get started'}>
        <div className="schedule-fields"><label>Game night date<input type="date" value={date} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setDate(e.target.value)} required /></label><label>Start time<input type="time" value={time} onChange={(e) => setTime(e.target.value)} required /></label></div>
        <label>Squad note <span className="small">(optional)</span><textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Ranked grind? Casual games? Bring snacks…" /></label>
        {error && <p className="error" role="alert">{error}</p>}
        <div className="planner-submit"><Button variant="primary" type="submit" disabled={saving}>{saving ? 'Creating game night…' : 'Create game night'}</Button><span className="small">You can view the session after it's created.</span></div>
      </Card>
    </form>
  </main>
}
