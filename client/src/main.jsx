import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles.css'

// import.meta.env.BASE_URL matches whatever vite.config.js's `base` is set to.
// On GitHub Pages that's "/your-repo-name/", not "/" — the Pages workflow sets
// VITE_BASE_PATH for the build, and vite.config.js reads it into `base`.
// Passing the same value as the router's basename is what keeps routes like
// /dashboard working under that subfolder instead of 404ing. See
// START-HERE.md's troubleshooting table: "Refreshing a nested route gives 404".
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
