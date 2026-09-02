import React, { useEffect, useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import AboutMe from './pages/AboutMe'
import Giphy from './pages/Giphy'
import NotFound from './pages/NotFound'

export default function App() {
  const location = useLocation()

  useEffect(() => {
    // ensure CSS variables have defaults
    const doc = document.documentElement
    doc.style.setProperty('--mouse-x', '50%')
    doc.style.setProperty('--mouse-y', '50%')
    function onMove(e: MouseEvent) {
      const x = e.clientX + 'px'
      const y = e.clientY + 'px'
      doc.style.setProperty('--mouse-x', x)
      doc.style.setProperty('--mouse-y', y)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useEffect(() => {
    // scroll to top on navigation
    window.scrollTo(0, 0)
  }, [location.pathname])

  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      const v = localStorage.getItem('navCollapsed')
      return v === null ? true : v === 'true'
    } catch {
      return true
    }
  })

  function toggleRail() {
    const next = !collapsed
    setCollapsed(next)
    try { localStorage.setItem('navCollapsed', String(next)) } catch {}
  }

  

  return (
    <div className={`app-root ${collapsed ? 'collapsed' : 'expanded'}`}>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-me" element={<AboutMe />} />
          <Route path="/giphy" element={<Giphy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <aside className={`nav-rail ${collapsed ? 'collapsed' : 'expanded'}`} aria-label="Primary navigation">
        <button
          className="rail-toggle"
          aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
          aria-expanded={!collapsed}
          onClick={toggleRail}
        >
          <span className="material-icons">menu</span>
        </button>

        <nav>
          <Link to="/" className="nav-item" aria-current={location.pathname === '/' ? 'page' : undefined}
            onClick={() => { setCollapsed(true); try { localStorage.setItem('navCollapsed', 'true') } catch {} }}>
            <span className="material-icons">home</span>
            <span className="nav-label">Home</span>
          </Link>

          <Link to="/giphy" className="nav-item" aria-current={location.pathname === '/giphy' ? 'page' : undefined}
            onClick={() => { setCollapsed(true); try { localStorage.setItem('navCollapsed', 'true') } catch {} }}>
            <span className="material-icons">gif</span>
            <span className="nav-label">Giphy</span>
          </Link>

          <Link to="/about-me" className="nav-item" aria-current={location.pathname === '/about-me' ? 'page' : undefined}
            onClick={() => { setCollapsed(true); try { localStorage.setItem('navCollapsed', 'true') } catch {} }}>
            <span className="material-icons">info</span>
            <span className="nav-label">About</span>
          </Link>
        </nav>
      </aside>
    </div>
  )
}
