import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Header from './components/Header.jsx'
import Join from './pages/Join.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Availability from './pages/Availability.jsx'
import Planner from './pages/Planner.jsx'
import SessionDetails from './pages/SessionDetails.jsx'
import History from './pages/History.jsx'

export default function App() {
  const location = useLocation()
  // The Join screen has no nav bar — you're not "in" a squad yet.
  const hideHeader = location.pathname === '/join' || location.pathname === '/'

  return (
    <>
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/" element={<Navigate to="/join" replace />} />
        <Route path="/join" element={<Join />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/availability" element={<Availability />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/sessions/:id" element={<SessionDetails />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </>
  )
}
