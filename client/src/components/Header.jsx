import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  CalendarClock,
  Vote,
  History as HistoryIcon,
  Copy,
  Check,
  Moon,
  Sparkles,
} from 'lucide-react'
import Logo from './Logo.jsx'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/availability', label: 'Availability', icon: CalendarClock },
  { to: '/planner', label: 'Planner', icon: Vote },
  { to: '/history', label: 'History', icon: HistoryIcon },
]

export default function Header() {
  const username = localStorage.getItem('squadnight_username')
  const squadCode = localStorage.getItem('squadnight_squadCode')
  const [copied, setCopied] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem('squadnight_theme') || 'midnight')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('squadnight_theme', theme)
  }, [theme])

  function copyCode() {
    if (!squadCode) return
    navigator.clipboard?.writeText(squadCode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
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
        {username && squadCode && (
          <button className="squad-pill" onClick={copyCode} title="Copy squad code">
            <span className="squad-pill-user">{username}</span>
            <span className="squad-pill-code">{squadCode}</span>
            {copied ? <Check size={13} /> : <Copy size={13} />}
          </button>
        )}
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
          {theme === 'midnight' ? <Sparkles size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  )
}
