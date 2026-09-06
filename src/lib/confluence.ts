export type ConfluenceBlogPost = {
  id: string
  title: string
  url: string
  created: string
  excerpt: string
  bodyHtml: string
  imageUrl?: string
  readTime?: string
}

function getConfluenceBaseUrl() {
  return ((import.meta as any).env.VITE_CONFLUENCE_BASE_URL ?? 'https://radityoardi.atlassian.net').replace(/\/$/, '')
}

function getConfluenceSpaceKey() {
  return ((import.meta as any).env.VITE_CONFLUENCE_SPACE_KEY ?? '~rd').trim()
}

function getConfluenceRequestBase() {
  return '/api/confluence'
}

function getConfluenceEmail() {
  return ((import.meta as any).env.VITE_CONFLUENCE_EMAIL ?? '').trim()
}

function getConfluenceApiToken() {
  return ((import.meta as any).env.VITE_CONFLUENCE_API_TOKEN ?? '').trim()
}

function buildAuthHeader() {
  const email = getConfluenceEmail()
  const token = getConfluenceApiToken()

  if (!email || !token) {
    return null
  }

  return `Basic ${btoa(`${email}:${token}`)}`
}

function normalizeDate(value?: string | Date | number | null) {
  if (value == null) return ''

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? '' : value.toISOString()
  }

  if (typeof value === 'number') {
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString()
  }

  const trimmed = value.trim()
  if (!trimmed) return ''

  const parsed = new Date(trimmed)
  return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString()
}

function formatDateLabel(value?: string | Date | number | null) {
  const normalized = normalizeDate(value)
  if (!normalized) return 'Date unavailable'

  const parsed = new Date(normalized)
  return Number.isNaN(parsed.getTime()) ? 'Date unavailable' : parsed.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

export function getBlogPostDateLabel(value?: string) {
  return formatDateLabel(value)
}

function stripHtml(html: string) {
  if (!html) return ''

  const doc = new DOMParser().parseFromString(html, 'text/html')
  return (doc.body.textContent || '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function estimateReadTime(html?: string) {
  const text = stripHtml(html || '')
  if (!text) return '1 min read'

  const wordCount = text.split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(wordCount / 220))
  return `${minutes} min read`
}

function extractImage(html: string) {
  if (!html) return undefined

  const doc = new DOMParser().parseFromString(html, 'text/html')

  const candidates = Array.from(doc.getElementsByTagName('img'))
  for (const node of candidates) {
    const src = node.getAttribute('src') || node.getAttribute('data-src') || node.getAttribute('href')
    if (src) return src
  }

  const xmlCandidates = Array.from(doc.getElementsByTagName('*')).filter((node) => {
    const tag = (node.tagName || '').toLowerCase()
    return tag === 'ac:image' || tag === 'ri:attachment' || tag === 'attachment'
  })

  for (const node of xmlCandidates) {
    const src = node.getAttribute('src') || node.getAttribute('data-src') || node.getAttribute('href')
    if (src) return src
  }

  const match = html.match(/(?:src|data-src|href)=(?:["'])((?:https?:)?\/\/[^"']+|\/[^"']+)(?:["'])/i)
  return match?.[1] || undefined
}

function mapPost(item: any, baseUrl: string): ConfluenceBlogPost {
  const html = item.body?.view?.value || item.body?.storage?.value || item.body?.editor?.value || item.macroRenderedOutput || ''
  const webui = item._links?.webui || ''
  const created = normalizeDate(
    item.created ||
      item.history?.createdDate ||
      item.version?.when ||
      item.history?.lastUpdated?.when ||
      item.history?.lastUpdated ||
      item.version?.friendlyWhen
  )

  const plainText = stripHtml(html)

  return {
    id: String(item.id),
    title: item.title || 'Untitled blog',
    url: webui ? `${baseUrl}/wiki${webui}` : '#',
    created,
    excerpt: plainText.slice(0, 220),
    bodyHtml: html,
    imageUrl: extractImage(html),
    readTime: estimateReadTime(html),
  }
}

export function isConfluenceConfigured() {
  return Boolean(getConfluenceBaseUrl() && getConfluenceSpaceKey() && getConfluenceEmail() && getConfluenceApiToken())
}

export async function fetchBlogPosts(): Promise<ConfluenceBlogPost[]> {
  if (!isConfluenceConfigured()) {
    throw new Error('Confluence is not configured. Add VITE_CONFLUENCE_* values in your .env file.')
  }

  const baseUrl = getConfluenceBaseUrl()
  const spaceKey = getConfluenceSpaceKey()
  const url = `${getConfluenceRequestBase()}?spaceKey=${encodeURIComponent(spaceKey)}&type=blogpost&limit=12&expand=body.view,body.storage,history,version,macroRenderedOutput,space`

  const authHeader = buildAuthHeader()
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      ...(authHeader ? { Authorization: authHeader } : {}),
    },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Confluence fetch failed (${res.status}): ${text.slice(0, 200)}`)
  }

  const data = await res.json()
  return (data.results || [])
    .map((item: any) => mapPost(item, baseUrl))
    .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
}

export async function fetchBlogPost(id: string): Promise<ConfluenceBlogPost> {
  if (!isConfluenceConfigured()) {
    throw new Error('Confluence is not configured. Add VITE_CONFLUENCE_* values in your .env file.')
  }

  const baseUrl = getConfluenceBaseUrl()
  const url = `${getConfluenceRequestBase()}/${id}?expand=body.view,body.storage,history,version,macroRenderedOutput,space`

  const authHeader = buildAuthHeader()
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      ...(authHeader ? { Authorization: authHeader } : {}),
    },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Confluence fetch failed (${res.status}): ${text.slice(0, 200)}`)
  }

  const item = await res.json()
  return mapPost(item, baseUrl)
}
