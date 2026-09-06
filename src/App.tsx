import React, { useEffect, useMemo, useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import AboutMe from './pages/AboutMe'
import Giphy from './pages/Giphy'
import Blog from './pages/Blog'
import BlogDetail from './pages/BlogDetail'
import NotFound from './pages/NotFound'

const DOT_SPACING = 50
const GRAVITY_RADIUS = 300

export default function App() {
  const location = useLocation()
  const [mouse, setMouse] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const [fabOpen, setFabOpen] = useState(false)

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
    setFabOpen(false)
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

  return (
    <div className="app-root">
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

      <div className="mouse-favicon" aria-hidden="true" style={{ left: mouse.x, top: mouse.y }}>
        <img src="/favico/favicon-16x16.png" alt="" />
      </div>

      <div className="fab-shell" aria-label="Quick navigation">
        <button
          type="button"
          className="fab-button"
          aria-label={fabOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={fabOpen}
          onClick={() => setFabOpen((open) => !open)}
        >
          <span className="material-icons">{fabOpen ? 'close' : 'menu'}</span>
        </button>

        <nav className={`fab-menu ${fabOpen ? 'open' : ''}`} aria-label="Primary navigation">
          <Link to="/" className="fab-item" aria-current={location.pathname === '/' ? 'page' : undefined} onClick={() => setFabOpen(false)}>
            <span className="material-icons">home</span>
            <span className="fab-text">
              <span className="fab-title">Homebase</span>
              <span className="fab-subtitle">Where the Wi‑Fi is strong and the thoughts are less so.</span>
            </span>
          </Link>

          <Link to="/blog" className="fab-item" aria-current={location.pathname.startsWith('/blog') ? 'page' : undefined} onClick={() => setFabOpen(false)}>
            <span className="material-icons">article</span>
            <span className="fab-text">
              <span className="fab-title">Blog</span>
              <span className="fab-subtitle">Notes, ideas, and the occasional very serious nonsense.</span>
            </span>
          </Link>

          <Link to="/giphy" className="fab-item" aria-current={location.pathname === '/giphy' ? 'page' : undefined} onClick={() => setFabOpen(false)}>
            <span className="material-icons">gif</span>
            <span className="fab-text">
              <span className="fab-title">GIF Palace</span>
              <span className="fab-subtitle">The kingdom of looping chaos and emotional support memes.</span>
            </span>
          </Link>

          <Link to="/about-me" className="fab-item" aria-current={location.pathname === '/about-me' ? 'page' : undefined} onClick={() => setFabOpen(false)}>
            <span className="material-icons">info</span>
            <span className="fab-text">
              <span className="fab-title">About the Wizard</span>
              <span className="fab-subtitle">A brief tale of code, coffee, and pretending deadlines are suggestions.</span>
            </span>
          </Link>
        </nav>
      </div>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/about-me" element={<AboutMe />} />
          <Route path="/giphy" element={<Giphy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}
