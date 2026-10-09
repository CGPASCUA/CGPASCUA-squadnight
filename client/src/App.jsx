import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Header from './components/Header.jsx'
import Join from './pages/Join.jsx'
import SquadSetup from './pages/SquadSetup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Availability from './pages/Availability.jsx'
import Planner from './pages/Planner.jsx'
import SessionDetails from './pages/SessionDetails.jsx'
import History from './pages/History.jsx'

function Protected({ children }) {
  return localStorage.getItem('squadnight_token') ? children : <Navigate to="/join" replace />
}

export default function App() {
  const location = useLocation()
  const authenticated = Boolean(localStorage.getItem('squadnight_token'))
  const hideHeader = ['/join', '/', '/squad'].includes(location.pathname)
  return (
    <>
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/" element={<Navigate to={authenticated ? '/squad' : '/join'} replace />} />
        <Route path="/join" element={authenticated ? <Navigate to="/squad" replace /> : <Join />} />
        <Route path="/squad" element={<Protected><SquadSetup /></Protected>} />
        <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
        <Route path="/availability" element={<Protected><Availability /></Protected>} />
        <Route path="/planner" element={<Protected><Planner /></Protected>} />
        <Route path="/sessions/:id" element={<Protected><SessionDetails /></Protected>} />
        <Route path="/history" element={<Protected><History /></Protected>} />
      </Routes>
    </>
  )
}
