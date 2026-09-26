import { NavLink } from 'react-router-dom'

// Shown on every screen except Join. NavLink adds the "active" class
// automatically when its route matches the current page.
export default function Header() {
  // No backend yet, so "who's logged in" just lives in localStorage — set by
  // the Join screen. Swap this for real user/session data once the API and
  // database exist.
  const username = localStorage.getItem('squadnight_username')
  const squadCode = localStorage.getItem('squadnight_squadCode')

  return (
    <header className="header">
      <span className="logo">
        SquadNight
        {username && (
          <span className="small" style={{ marginLeft: 10, fontWeight: 400 }}>
            {username} · {squadCode}
          </span>
        )}
      </span>
      <nav>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/availability">Availability</NavLink>
        <NavLink to="/planner">Planner</NavLink>
        <NavLink to="/history">History</NavLink>
      </nav>
    </header>
  )
}
