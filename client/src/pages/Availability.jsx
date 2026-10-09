import { useEffect, useState } from 'react'
import { getAvailability, saveAvailability } from '../api/index.js'
import Card from '../components/Card.jsx'
import Button from '../components/Button.jsx'

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function Availability() {
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)
  const [mine, setMine] = useState(null)
  const [others, setOthers] = useState([])
  const [saved, setSaved] = useState(false)

  async function load() {
    setStatus('loading')
    setError(null)
    try {
      const data = await getAvailability()
      setMine(data.mine)
      setOthers(data.others)
      setStatus('ready')
    } catch (caught) {
      setError(caught)
      setStatus('error')
    }
  }

  useEffect(() => { load() }, [])

  function updateDay(day, field, value) {
    setMine({ ...mine, [day]: { ...mine[day], [field]: value } })
    setSaved(false)
  }

  async function handleSave() {
    await saveAvailability(mine)
    setSaved(true)
  }

  if (status === 'loading') return <div className="container">Loading…</div>
  if (status === 'error') {
    return (
      <div className="container">
        <p className="error" role="alert">{error.message} <button onClick={load}>Try again</button></p>
      </div>
    )
  }

  return (
    <div className="container">
      <Card title="Member" meta="You" />
      <h3>Your Weekly Availability</h3>
      <table className="week">
        <thead>
          <tr><th></th>{days.map((d) => <th key={d}>{d}</th>)}</tr>
        </thead>
        <tbody>
          <tr>
            <td>Day</td>
            {days.map((d) => (
              <td key={d}>
                <input type="checkbox" checked={mine[d].checked} onChange={(e) => updateDay(d, 'checked', e.target.checked)} style={{ width: 'auto', margin: 0 }} />
              </td>
            ))}
          </tr>
          <tr>
            <td>Start</td>
            {days.map((d) => (
              <td key={d}>
                <input type="time" value={mine[d].start} onChange={(e) => updateDay(d, 'start', e.target.value)} style={{ margin: 0, fontSize: 11, padding: 2 }} disabled={!mine[d].checked} />
              </td>
            ))}
          </tr>
          <tr>
            <td>End</td>
            {days.map((d) => (
              <td key={d}>
                <input type="time" value={mine[d].end} onChange={(e) => updateDay(d, 'end', e.target.value)} style={{ margin: 0, fontSize: 11, padding: 2 }} disabled={!mine[d].checked} />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <Button variant="primary" onClick={handleSave}>Save / Update Availability</Button>
      {saved && <span className="small" style={{ marginLeft: 10 }}>Saved.</span>}

      <Card title="Other Members' Availability">
        {others.map((o) => (
          <div key={o.name} className="small">{o.name}: {o.days}</div>
        ))}
      </Card>

      <div className="grid-2">
        <Card title="Overlapping Availability" meta="Fri 8–10 PM (4/5 members)" />
        <Card title="Suggested Best Time" meta="Fri 8:00 PM">
          <Button variant="accent">Plan Game Night</Button>
        </Card>
      </div>
    </div>
  )
}
