import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="page not-found">
      <h1>404 — Page not found</h1>
      <p>
        This page has officially fallen into a black hole, which is fitting because the internet is already a cosmic dumpster fire of broken links, abandoned tabs, and half-finished dreams. One moment it was here, bright and hopeful, and the next it was swallowed by a singularity of bad routing, stale bookmarks, and the sort of existential dread usually reserved for opening the wrong folder at 2 a.m. If the universe had any sense, it would make dead URLs gently drift into the void with dramatic space music instead of leaving us staring at an empty page like a confused astronaut who just lost the map to the galaxy. So yes, this page is lost in the event horizon, doomed to orbit forever in the dark, while the rest of the web keeps spinning smugly around it as if nothing happened.
      </p>

      <img
        src="https://i.giphy.com/7zoOcZshec8nqdFKeG.webp"
        alt="404 not found GIF"
        style={{
          display: 'block',
          maxWidth: '100%',
          width: 'min(100%, 420px)',
          height: 'auto',
          borderRadius: '16px',
          margin: '20px auto 16px',
          boxShadow: '0 12px 32px rgba(2, 8, 20, 0.32)',
        }}
      />
    </section>
  )
}
