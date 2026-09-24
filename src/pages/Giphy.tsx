import React, { useEffect } from 'react'
import GiphySearch from '../components/GiphySearch'

export default function Giphy() {
  useEffect(() => {
    document.title = 'Radityo Ardi - Giphy'
  }, [])

  return (
    <section className="page">
      <h1>Giphy Search</h1>
      <GiphySearch />
    </section>
  )
}
