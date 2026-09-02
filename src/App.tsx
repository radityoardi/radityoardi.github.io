import React, { useEffect, useMemo, useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import AboutMe from './pages/AboutMe'
import Giphy from './pages/Giphy'
import NotFound from './pages/NotFound'

const DOT_SPACING = 50
const GRAVITY_RADIUS = 300

export default function App() {
  const location = useLocation()
  const [mouse, setMouse] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 })

  useEffect(() => {
    const doc = document.documentElement
    doc.style.setProperty('--mouse-x', '50%')
    doc.style.setProperty('--mouse-y', '50%')

    function onMove(e: MouseEvent) {
      const x = e.clientX
      const y = e.clientY
      doc.style.setProperty('--mouse-x', x + 'px')
      doc.style.setProperty('--mouse-y', y + 'px')
      setMouse({ x, y })
    }

    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  const dots = useMemo(() => {
    const rows = Math.ceil(window.innerHeight / DOT_SPACING) + 4
    const cols = Math.ceil(window.innerWidth / DOT_SPACING) + 4
    const list: Array<{ id: string; x: number; y: number; delay: number }> = []

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const x = col * DOT_SPACING
        const y = row * DOT_SPACING
        list.push({
          id: `${row}-${col}`,
          x,
          y,
          delay: (row + col) * 0.12,
        })
      }
    }

    return list
  }, [])

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
      <div className="dot-grid" aria-hidden="true">
        {dots.map((dot) => {
          const dx = mouse.x - dot.x
          const dy = mouse.y - dot.y
          const dist = Math.hypot(dx, dy) || 1
          const strength = Math.max(0, 1 - dist / GRAVITY_RADIUS)
          const pull = strength * 18
          const offsetX = (dx / dist) * pull
          const offsetY = (dy / dist) * pull

          return (
            <span
              key={dot.id}
              className="dot"
              style={{
                left: `${dot.x}px`,
                top: `${dot.y}px`,
                width: '1px',
                height: '1px',
                transform: `translate(${offsetX}px, ${offsetY}px)`,
                animationDelay: `${dot.delay}s`,
              }}
            />
          )
        })}
      </div>

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
