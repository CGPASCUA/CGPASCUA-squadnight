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
} from 'lucide-react'
import Logo from './Logo.jsx'
import { useNavigate } from 'react-router-dom'
import { logoutAccount } from '../api/index.js'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/availability', label: 'Availability', icon: CalendarClock },
  { to: '/planner', label: 'Planner', icon: Vote },
  { to: '/history', label: 'History', icon: HistoryIcon },
]

export default function Header() {
  const username = localStorage.getItem('squadnight_username')
  const navigate = useNavigate()
  const [theme, setTheme] = useState(() => localStorage.getItem('squadnight_theme') || 'midnight')

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
        {username && <span className="squad-pill"><span className="squad-pill-user">{username}</span></span>}
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
