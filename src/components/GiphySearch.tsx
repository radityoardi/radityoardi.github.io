import React, { useEffect, useState } from 'react'

type GifItem = {
  id: string
  title: string
  url: string
  username?: string
}

export default function GiphySearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GifItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const apiKey = (import.meta as any).env.VITE_GIPHY_APIKEY as string | undefined

  useEffect(() => {
    if (!query) {
      setResults([])
      setError(null)
      return
    }

    const id = setTimeout(() => {
      fetchResults(query)
    }, 350)

    return () => clearTimeout(id)
  }, [query])

  async function fetchResults(q: string) {
    if (!apiKey) {
      setError('GIPHY API key not configured. Set VITE_GIPHY_APIKEY.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ api_key: apiKey, q, limit: '24', rating: 'pg-13' })
      const res = await fetch(`https://api.giphy.com/v1/gifs/search?${params.toString()}`)
      if (!res.ok) throw new Error(`Giphy error ${res.status}`)
      const data = await res.json()
      const mapped: GifItem[] = data.data.map((g: any) => ({
        id: g.id,
        title: g.title || 'GIF',
        url: g.images?.downsized_medium?.url || g.images?.fixed_width?.url,
        username: g.username || undefined,
      }))
      setResults(mapped)
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="giphy-search">
      <div className="search-row">
        <label className="search-field" htmlFor="giphy-query">
          <span className="material-icons">search</span>
          <input
            id="giphy-query"
            placeholder="Search Giphy"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') fetchResults(query) }}
            aria-label="Search Giphy"
          />
        </label>
        {loading && <div className="loader">Searching…</div>}
      </div>

      {error && <div className="error">{error}</div>}

      <div className="giphy-grid" role="list">
        {results.map((g) => (
          <article className="giphy-card" key={g.id} role="listitem">
            <a href={g.url} target="_blank" rel="noopener noreferrer">
              <img src={g.url} alt={g.title} loading="lazy" />
            </a>
            <div className="card-body">
              <div className="card-title">{g.title}</div>
              <div className="card-sub">{g.username || 'Giphy'}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
