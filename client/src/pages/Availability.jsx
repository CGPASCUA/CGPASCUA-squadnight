import { useEffect, useState } from 'react'
import { getAvailability, saveAvailability } from '../api/index.js'
import Card from '../components/Card.jsx'
import Button from '../components/Button.jsx'

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const blankWeek = () => Object.fromEntries(days.map((day) => [day, { checked: false, start: '19:00', end: '22:00' }]))
function normalize(data) {
  const raw = data?.mine && typeof data.mine === 'object' ? data.mine : data && days.some((d) => data[d]) ? data : {}
  const mine = blankWeek()
  for (const day of days) {
    const value = raw?.[day]
    if (value && typeof value === 'object') mine[day] = { checked: Boolean(value.checked), start: typeof value.start === 'string' ? value.start : '19:00', end: typeof value.end === 'string' ? value.end : '22:00' }
  }
  return { mine, others: Array.isArray(data?.others) ? data.others : [] }
}

export default function Availability() {
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [mine, setMine] = useState(blankWeek)
  const [others, setOthers] = useState([])
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  async function load() {
    setStatus('loading'); setError('')
    try { const data = normalize(await getAvailability()); setMine(data.mine); setOthers(data.others); setStatus('ready') }
    catch (caught) { setError(caught?.message || 'Could not load availability.'); setStatus('error') }
  }
  useEffect(() => { load() }, [])
  function updateDay(day, field, value) { setMine((current) => ({ ...current, [day]: { ...current[day], [field]: value } })); setSaved(false) }
  async function handleSave() {
    setSaving(true); setError('')
    try { const result = await saveAvailability(mine); if (result?.mine) setMine(normalize(result).mine); setSaved(true) }
    catch (caught) { setError(caught?.message || 'Could not save availability. Please try again.') }
    finally { setSaving(false) }
  }
  if (status === 'loading') return <main className="container page-shell"><div className="page-heading"><span className="eyebrow">SQUAD SCHEDULING</span><h1>Your availability</h1><p className="small">Loading your weekly schedule…</p></div><Card><div className="loading-skeleton" /></Card></main>
  if (status === 'error') return <main className="container page-shell"><div className="page-heading"><span className="eyebrow">SQUAD SCHEDULING</span><h1>Your availability</h1></div><Card title="We couldn't load your schedule"><p className="small">{error}</p><Button variant="primary" onClick={load}>Try again</Button></Card></main>
  const selectedDays = days.filter((d) => mine[d].checked)
  return <main className="container page-shell">
    <div className="page-heading"><span className="eyebrow">MAKE GAME NIGHT HAPPEN</span><h1>Your availability</h1><p className="small">Pick the days and hours you can play. Your squad can use this to find a time that works for everyone.</p></div>
    <Card title="Your weekly schedule" meta={`${selectedDays.length} ${selectedDays.length === 1 ? 'day' : 'days'} available`}>
      <div className="availability-grid">
        {days.map((day) => <section key={day} className={`availability-day ${mine[day].checked ? 'is-available' : ''}`}>
          <label className="availability-day-toggle"><input type="checkbox" checked={mine[day].checked} onChange={(e) => updateDay(day, 'checked', e.target.checked)} /><span>{day}</span><span className="availability-indicator">{mine[day].checked ? 'Available' : 'Unavailable'}</span></label>
          <div className="availability-times"><label>From<input aria-label={`${day} start time`} type="time" value={mine[day].start} disabled={!mine[day].checked} onChange={(e) => updateDay(day, 'start', e.target.value)} /></label><label>Until<input aria-label={`${day} end time`} type="time" value={mine[day].end} disabled={!mine[day].checked} onChange={(e) => updateDay(day, 'end', e.target.value)} /></label></div>
        </section>)}
      </div>
      {error && <p className="error" role="alert">{error}</p>}
      <div className="availability-actions"><Button variant="primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save availability'}</Button>{saved && <span className="save-confirmation" role="status">✓ Availability saved</span>}</div>
    </Card>
    <Card title="Squad availability" meta="What your teammates have shared">
      {others.length ? <div className="availability-members">{others.map((member, index) => <div className="availability-member" key={`${member.name || 'member'}-${index}`}><span className="member-avatar">{(member.name || 'M').slice(0, 1).toUpperCase()}</span><div><strong>{member.name || 'Squad member'}</strong><p className="small">{member.days || 'No available days shared yet'}</p></div></div>)}</div> : <p className="small">No other squad availability has been shared yet. Once your teammates save their schedules, they'll appear here.</p>}
    </Card>
  </main>
}
