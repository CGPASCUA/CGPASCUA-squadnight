import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  CalendarClock,
  Vote,
  History as HistoryIcon,
  LogOut,
  Moon,
  Sparkles,
  ChevronDown, Users,
} from 'lucide-react'
import Logo from './Logo.jsx'
import { useNavigate } from 'react-router-dom'
import { logoutAccount, getMySquad } from '../api/index.js'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/availability', label: 'Availability', icon: CalendarClock },
  { to: '/planner', label: 'Planner', icon: Vote },
  { to: '/history', label: 'History', icon: HistoryIcon },
]

export default function Header() {
  const username = localStorage.getItem('squadnight_username')
  const navigate = useNavigate()
  const location = window.location
  const [theme, setTheme] = useState(() => localStorage.getItem('squadnight_theme') || 'midnight')
  const [squad, setSquad] = useState(null)
  const [squadOpen, setSquadOpen] = useState(false)

  useEffect(() => { getMySquad().then(setSquad).catch(() => setSquad(null)) }, [location.pathname])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('squadnight_theme', theme)
  }, [theme])

  async function handleLogout() {
    try { await logoutAccount() } catch { /* Clear the local session even if the API is unreachable. */ }
    localStorage.removeItem('squadnight_token')
    localStorage.removeItem('squadnight_username')
    localStorage.removeItem('squadnight_userId')
    navigate('/join', { replace: true })
  }

  function toggleTheme() {
    setTheme((t) => (t === 'midnight' ? 'sakura' : 'midnight'))
  }

  return (
    <header className="header">
      <div className="header-left">
        <Logo size={34} />
        <span className="logo-text">SquadNight</span>
      </div>

      <nav className="pill-nav">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `pill-link ${isActive ? 'active' : ''}`}>
            <Icon size={15} strokeWidth={2.2} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="header-right">
        {username && <div style={{position:'relative'}}>
          <button type="button" className="squad-pill" onClick={() => setSquadOpen(v => !v)} aria-expanded={squadOpen}>
            <span className="squad-pill-user">{squad?.name || 'No squad'}</span><ChevronDown size={14}/>
          </button>
          {squadOpen && <div style={{position:'absolute',right:0,top:'calc(100% + 8px)',width:260,maxHeight:340,overflowY:'auto',zIndex:30,padding:14,background:'var(--color-surface)',border:'1px solid var(--color-border)',borderRadius:14,boxShadow:'var(--shadow-card)'}}>
            {squad ? <><strong>{squad.name}</strong><p className="small" style={{margin:'6px 0 10px'}}><Users size={13} style={{verticalAlign:'middle'}}/> {squad.members?.length ?? 0} members · Code: {squad.joinCode}</p>
              {(squad.members || []).map(member => <div key={member.id} style={{display:'flex',justifyContent:'space-between',gap:8,padding:'7px 0',borderTop:'1px solid var(--color-border)',fontSize:13}}><span>{member.username}{member.id === localStorage.getItem('squadnight_userId') ? ' (you)' : ''}</span><span className="small">{member.role}</span></div>)}
              <button type="button" className="btn btn-ghost" style={{width:'100%',marginTop:10}} onClick={() => {setSquadOpen(false);navigate('/squad')}}>Manage squad / switch</button>
            </> : <><p className="small">You haven't joined a squad yet.</p><button type="button" className="btn btn-primary" onClick={() => {setSquadOpen(false);navigate('/squad')}}>Find a squad</button></>}
          </div>}
        </div>}
        <button className="theme-toggle" onClick={handleLogout} title="Log out" aria-label="Log out">
          <LogOut size={16} />
        </button>
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
          {theme === 'midnight' ? <Sparkles size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  )
}
