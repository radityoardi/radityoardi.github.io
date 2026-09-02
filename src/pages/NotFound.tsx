import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="page not-found">
      <h1>404 — Page not found</h1>
      <p>Sorry, the page you requested doesn't exist. It may have been moved or removed.</p>
      <p>
        <Link to="/">Return home</Link>
      </p>
    </section>
  )
}
