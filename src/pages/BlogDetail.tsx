import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ConfluenceBlogPost, fetchBlogPost, getBlogPostDateLabel } from '../lib/confluence'

export default function BlogDetail() {
  const { id } = useParams()
  const [post, setPost] = useState<ConfluenceBlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      if (!id) {
        setError('Missing blog ID.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const data = await fetchBlogPost(id)
        console.log('Blog post details:', data)
        setPost(data)
      } catch (err: any) {
        setError(err?.message || 'Failed to load blog post.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id])

  if (loading) {
    return (
      <section className="page blog-detail-page">
        <p>Loading blog post…</p>
      </section>
    )
  }

  if (error || !post) {
    return (
      <section className="page blog-detail-page">
        <p className="error">{error || 'Post not found.'}</p>
        <Link to="/blog">Back to Blog</Link>
      </section>
    )
  }

  return (
    <section className="page blog-detail-page">
      <Link to="/blog" className="back-link">← Back to Blog</Link>
      <article className="blog-article">
        <div className="blog-detail-meta">{getBlogPostDateLabel(post.created)}</div>
        <h1>{post.title}</h1>
        <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.bodyHtml }} />
      </article>
    </section>
  )
}
