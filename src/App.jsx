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
import ReactMarkdown from 'react-markdown'

import MenuIcon from '@mui/icons-material/Menu'
import HomeIcon from '@mui/icons-material/Home'
import InfoIcon from '@mui/icons-material/Info'
import Avatar from '@mui/material/Avatar'
import AvatarImg from './assets/img/ToonRadityoCircle.png'
import pagesConfig from './pages.config.json'

const iconMap = {
  MenuIcon,
  HomeIcon,
  InfoIcon,
}

const resolvePageId = () => {
  const pathname = window.location.pathname
  const match = pagesConfig.pages.find((page) => page.path === pathname)
  return match ? match.id : (pagesConfig.pages.find((page) => page.default)?.id ?? pagesConfig.pages[0].id)
}
export default function App() {
  const ref = useRef(null)
  const [open, setOpen] = useState(false)
  const [pageId, setPageId] = useState(() => resolvePageId())
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  const activePage = pagesConfig.pages.find((page) => page.id === pageId) ?? pagesConfig.pages[0]
  const MenuButtonIcon = iconMap[pagesConfig.menu.buttonIcon] ?? MenuIcon

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

  useEffect(() => {
    let isMounted = true
    setLoading(true)

    fetch(`/pages/${activePage.file}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load ${activePage.file}`)
        }
        return response.text()
      })
      .then((markdown) => {
        if (isMounted) {
          setContent(markdown)
        }
      })
      .catch(() => {
        if (isMounted) {
          setContent(`# Unable to load content\n\nThe page content for ${activePage.label} could not be loaded.`)
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [activePage])

  const toggleDrawer = (value) => () => setOpen(value)

  useEffect(() => {
    const onPopState = () => setPageId(resolvePageId())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const navigate = (nextPageId) => {
    const nextPage = pagesConfig.pages.find((page) => page.id === nextPageId)
    if (!nextPage) return

    window.history.pushState({}, '', nextPage.path)
    setPageId(nextPage.id)
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
            <MenuButtonIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Toolbar />

      <Container sx={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {loading ? (
          <Box sx={{ color: 'text.primary', p: 4, maxWidth: 800 }}>
            <Typography variant="body1">Loading content...</Typography>
          </Box>
        ) : (
          <Box
            sx={{
              color: 'text.primary',
              p: 4,
              maxWidth: 800,
              '& h1': { fontSize: '2.5rem', lineHeight: 1.2, mb: 2 },
              '& h2': { fontSize: '2rem', lineHeight: 1.3, mb: 2 },
              '& p': { fontSize: '1.05rem', lineHeight: 1.8, mb: 2 },
              '& ul, & ol': { pl: 3, mb: 2, lineHeight: 1.8 },
            }}
          >
            <ReactMarkdown>{content}</ReactMarkdown>
          </Box>
        )}
      </Container>

      <Drawer anchor={pagesConfig.menu.drawerAnchor ?? 'right'} open={open} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 260 }} role="presentation" onKeyDown={() => setOpen(false)}>
          <List>
            {pagesConfig.pages.map((page) => {
              const PageIcon = iconMap[page.icon] ?? InfoIcon
              return (
                <ListItemButton key={page.id} onClick={() => navigate(page.id)}>
                  <ListItemIcon>
                    <PageIcon />
                  </ListItemIcon>
                  <ListItemText primary={page.label} />
                </ListItemButton>
              )
            })}
          </List>
        </Box>
      </Drawer>
    </div>
  )
}
