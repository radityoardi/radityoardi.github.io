import React, { useEffect, useState } from 'react'

type GifItem = {
  id: string
  title: string
  url: string
  username?: string
}

const PINNED_SEARCH_STORAGE_KEY = 'giphy-pinned-searches'

function readPinnedSearches(): string[] {
  try {
    const raw = localStorage.getItem(PINNED_SEARCH_STORAGE_KEY)
    if (!raw) return []
    return raw
      .split('|')
      .map((term) => term.trim())
      .filter(Boolean)
  } catch {
    return []
  }
}

function writePinnedSearches(terms: string[]) {
  const value = terms.join('|')
  try {
    localStorage.setItem(PINNED_SEARCH_STORAGE_KEY, value)
  } catch {
    // ignore storage issues in restricted browsers
  }

  try {
    document.cookie = `giphyPinnedSearches=${encodeURIComponent(value)}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
  } catch {
    // ignore cookie issues in restricted browsers
  }
}

export default function GiphySearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GifItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pinnedSearches, setPinnedSearches] = useState<string[]>(() => readPinnedSearches())
  const [selectedPinned, setSelectedPinned] = useState<string | null>(null)

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

  function handlePinSearch() {
    const clean = query.trim()
    if (!clean) return

    const nextPinned = Array.from(new Set([clean, ...pinnedSearches])).filter(Boolean)
    setPinnedSearches(nextPinned)
    writePinnedSearches(nextPinned)
    setSelectedPinned(clean)
    fetchResults(clean)
  }

  function handlePinnedClick(term: string) {
    if (selectedPinned === term) {
      setSelectedPinned(null)
      setQuery('')
      setResults([])
      setError(null)
      return
    }

    setSelectedPinned(term)
    setQuery(term)
    fetchResults(term)
  }

  function handleDeletePinned(term: string) {
    const filtered = pinnedSearches.filter((saved) => saved !== term)
    setPinnedSearches(filtered)
    writePinnedSearches(filtered)

    if (selectedPinned === term) {
      setSelectedPinned(null)
      setQuery('')
      setResults([])
      setError(null)
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
            onChange={(e) => {
              const nextValue = e.target.value
              setQuery(nextValue)
              if (selectedPinned && nextValue !== selectedPinned) {
                setSelectedPinned(null)
              }
            }}
            onKeyDown={(e) => { if (e.key === 'Enter') fetchResults(query) }}
            aria-label="Search Giphy"
          />
        </label>
        <button type="button" className="filled-button" onClick={handlePinSearch}>
          Pin search
        </button>
        {loading && <div className="loader">Searching…</div>}
      </div>

      {pinnedSearches.length > 0 && (
        <div className="pinned-searches" aria-label="Pinned searches">
          {pinnedSearches.map((term) => (
            <div key={term} className={`pinned-search ${selectedPinned === term ? 'selected' : ''}`}>
              <button
                type="button"
                className="pinned-search-label"
                onClick={() => handlePinnedClick(term)}
                aria-pressed={selectedPinned === term}
              >
                {term}
              </button>

              <button
                type="button"
                className="pinned-search-remove"
                aria-label={`Remove saved search ${term}`}
                title={`Remove ${term}`}
                onClick={() => handleDeletePinned(term)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

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
