import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ConfluenceBlogPost, fetchBlogPosts, getBlogPostDateLabel, isConfluenceConfigured } from '../lib/confluence'

export default function Blog() {
  const [posts, setPosts] = useState<ConfluenceBlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError(null)
        if (!isConfluenceConfigured()) {
          throw new Error('Add VITE_CONFLUENCE_BASE_URL, VITE_CONFLUENCE_SPACE_KEY, VITE_CONFLUENCE_EMAIL, and VITE_CONFLUENCE_API_TOKEN to your .env file.')
        }

        const data = await fetchBlogPosts()
        setPosts(data)
      } catch (err: any) {
        setError(err?.message || 'Failed to load blog posts.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (loading) {
    return (
      <section className="page blog-page">
        <h1>Blog</h1>
        <p>Loading posts…</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="page blog-page">
        <h1>Blog</h1>
        <p className="error">{error}</p>
      </section>
    )
  }

  return (
    <section className="page blog-page">
      <h1>Blog</h1>
      <div className="blog-grid">
        {posts.map((post) => (
          <Link key={post.id} to={`/blog/${post.id}`} className="blog-card">
            {post.imageUrl ? (
              <img src={post.imageUrl} alt={post.title} className="blog-card-image" />
            ) : (
              <div className="blog-card-image placeholder">Blog</div>
            )}
            <div className="blog-card-body">
              <div className="blog-card-date">
                {getBlogPostDateLabel(post.created)}
                {post.readTime ? ` • ${post.readTime}` : ''}
              </div>
              <h2>{post.title}</h2>
              <p>{post.excerpt || 'Read more...'}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
