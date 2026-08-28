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

const iconMap = {
  MenuIcon,
  HomeIcon,
  InfoIcon,
}

const normalizePath = (value) => {
  if (!value || value === '/') return '/'

  const normalized = value.startsWith('/') ? value : `/${value}`
  return normalized.length > 1 && normalized.endsWith('/') ? normalized.slice(0, -1) : normalized
}

const getInitialPathFromQuery = () => {
  const params = new URLSearchParams(window.location.search)
  const path = params.get('path')
  return path ? normalizePath(path) : null
}

const resolvePageId = (pagesConfig, pathname = window.location.pathname) => {
  const candidatePath = getInitialPathFromQuery() ?? pathname
  const normalizedPath = normalizePath(candidatePath)
  const match = pagesConfig.pages.find((page) => normalizePath(page.path) === normalizedPath)

  if (match) {
    return match.id
  }

  const notFoundPage = pagesConfig.pages.find((page) => page.type === 'markdown' && page.hidden === true && page.id === 'not-found')
  return notFoundPage ? notFoundPage.id : (pagesConfig.pages.find((page) => page.default)?.id ?? pagesConfig.pages[0].id)
}

export default function App() {
  const ref = useRef(null)
  const [open, setOpen] = useState(false)
  const [pagesConfig, setPagesConfig] = useState(null)
  const [pageId, setPageId] = useState('home')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [configLoading, setConfigLoading] = useState(true)

  useEffect(() => {
    fetch('/pages.config.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load pages.config.json')
        }
        return response.json()
      })
      .then((config) => {
        setPagesConfig(config)
        const resolvedPath = getInitialPathFromQuery() ?? window.location.pathname
        const initialPageId = resolvePageId(config, resolvedPath)
        setPageId(initialPageId)
        if (resolvedPath && window.location.pathname === '/') {
          window.history.replaceState({}, '', resolvedPath)
        }
      })
      .catch(() => {
        setPagesConfig({
          menu: { buttonIcon: 'MenuIcon', drawerAnchor: 'right' },
          pages: [
            { id: 'home', label: 'Home', path: '/', file: 'Home.md', icon: 'HomeIcon', type: 'markdown', default: true },
            { id: 'about', label: 'About', path: '/about', file: 'About.md', icon: 'InfoIcon', type: 'markdown' },
            { id: 'not-found', label: 'Not Found', path: '/404', file: '404.md', icon: 'InfoIcon', type: 'markdown', hidden: true },
          ],
        })
      })
      .finally(() => setConfigLoading(false))
  }, [])

  const activePage = pagesConfig?.pages.find((page) => page.id === pageId) ?? pagesConfig?.pages[0] ?? null
  const MenuButtonIcon = pagesConfig ? (iconMap[pagesConfig.menu.buttonIcon] ?? MenuIcon) : MenuIcon

  useEffect(() => {
    if (!activePage) return
    document.title = activePage.title || activePage.label
  }, [activePage])

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
    if (!pagesConfig || !activePage) return

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
  }, [pagesConfig, activePage])

  const toggleDrawer = (value) => () => setOpen(value)

  useEffect(() => {
    if (!pagesConfig) return

    const onPopState = () => setPageId(resolvePageId(pagesConfig, window.location.pathname))
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [pagesConfig])

  const navigate = (nextPageId) => {
    if (!pagesConfig) return

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
        {configLoading || !pagesConfig || !activePage ? (
          <Box sx={{ color: 'text.primary', p: 4, maxWidth: 800 }}>
            <Typography variant="body1">Loading content...</Typography>
          </Box>
        ) : loading ? (
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

      {pagesConfig && (
        <Drawer anchor={pagesConfig.menu.drawerAnchor ?? 'right'} open={open} onClose={toggleDrawer(false)}>
          <Box sx={{ width: 260 }} role="presentation" onKeyDown={() => setOpen(false)}>
            <List>
              {pagesConfig.pages
                .filter((page) => !page.hidden)
                .map((page) => {
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
      )}
    </div>
  )
}
