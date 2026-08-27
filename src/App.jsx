import React, { useRef, useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import MenuIcon from '@mui/icons-material/Menu'
import HomeIcon from '@mui/icons-material/Home'
import InfoIcon from '@mui/icons-material/Info'
import Avatar from '@mui/material/Avatar'
import About from './pages/About'
import AvatarImg from './assets/img/ToonRadityoCircle.png'

export default function App() {
  const ref = useRef(null)
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(() => window.location.pathname === '/about' ? 'about' : 'home')

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      el.style.setProperty('--mx', `${x}px`)
      el.style.setProperty('--my', `${y}px`)
    }

    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  const toggleDrawer = (value) => () => setOpen(value)

  useEffect(() => {
    const onPopState = () => setPage(window.location.pathname === '/about' ? 'about' : 'home')
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const navigate = (nextPage) => {
    const path = nextPage === 'about' ? '/about' : '/'
    window.history.pushState({}, '', path)
    setPage(nextPage)
    setOpen(false)
  }

  return (
    <div ref={ref} className="bg-root">
      <AppBar position="fixed" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(6px)' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="profile" sx={{ mr: 1 }}>
            <Avatar src={AvatarImg} alt="avatar" sx={{ width: 24, height: 24 }} />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }} />
          <IconButton edge="end" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Toolbar />

      <Container sx={{ height: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {page === 'home' && (
          <Box sx={{ color: 'text.primary', p: 4, maxWidth: 800 }}>
            <Typography variant="h3" component="h1" gutterBottom>
              Hello World, I'm Radityo Ardi!
            </Typography>
            <Typography variant="body1" paragraph>
              I’m a technologist, which means I spend my days turning coffee into code, debugging with the calm demeanor of a detective who has absolutely no idea what happened, and pretending “it’s just a small config issue” is a valid explanation for a full-blown production panic. In other words, I build systems, solve puzzles, and keep the digital universe from collapsing one stack trace at a time—while somehow still acting like I meant to do it.
            </Typography>
          </Box>
        )}
        {page === 'about' && <About />}
      </Container>

      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 260 }} role="presentation" onKeyDown={() => setOpen(false)}>
          <List>
            <ListItemButton onClick={() => navigate('home')}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
            <ListItemButton onClick={() => navigate('about')}>
              <ListItemIcon>
                <InfoIcon />
              </ListItemIcon>
              <ListItemText primary="About" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
    </div>
  )
}
