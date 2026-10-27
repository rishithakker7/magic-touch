import React, { useState, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useGallery } from '../lib/gallery'
import { waLink } from '../data/site'
import { Lightbox } from '../components/Lightbox'

export function Gallery() {
  const { items, loading } = useGallery()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = searchParams.get('category') || 'All'
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [density, setDensity] = useState('editorial') // 'editorial' | 'compact'

  const categories = useMemo(() => {
    const base = ['All', 'Earrings', 'Necklaces', 'Bangles', 'Rings']
    const extra = items
      .map((i) => i.category)
      .filter((c) => c && !base.includes(c))
    return [...base, ...new Set(extra)]
  }, [items])

  const filtered = useMemo(() => {
    if (activeCategory === 'All') return items
    return items.filter(
      (item) => (item.category || '').toLowerCase() === activeCategory.toLowerCase()
    )
  }, [items, activeCategory])

  const selectCategory = (cat) => {
    if (cat === 'All') {
      setSearchParams({})
    } else {
      setSearchParams({ category: cat })
    }
  }

  return (
    <div className="page-gallery">
      <section className="page-hero">
        <div className="container">
          <div className="page-hero__top">
            <div>
              <span className="eyebrow">Magic Touch · Mulund West</span>
              <h1 className="page-title">Gallery</h1>
              <p className="page-subtitle">
                Select any piece to view details or enquire on WhatsApp.
              </p>
            </div>
          </div>

          {/* Filter & View Bar */}
          <div className="gallery-toolbar">
            <div className="gallery-tabs" role="tablist" aria-label="Jewellery categories">
              {categories.map((cat) => {
                const count =
                  cat === 'All'
                    ? items.length
                    : items.filter((i) => (i.category || '').toLowerCase() === cat.toLowerCase())
                        .length
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={activeCategory === cat}
                    className={`gallery-tab ${
                      activeCategory === cat ? 'gallery-tab--active' : ''
                    }`}
                    onClick={() => selectCategory(cat)}
                  >
                    <span>{cat}</span>
                    <small>{count}</small>
                  </button>
                )
              })}
            </div>

            <div className="gallery-view-switch">
              <button
                type="button"
                className={`view-pill ${density === 'editorial' ? 'view-pill--active' : ''}`}
                onClick={() => setDensity('editorial')}
              >
                Editorial View
              </button>
              <button
                type="button"
                className={`view-pill ${density === 'compact' ? 'view-pill--active' : ''}`}
                onClick={() => setDensity('compact')}
              >
                Catalogue Grid
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tight-top">
        <div className="container">
          {loading ? (
            <div className="gallery-empty">Loading curated pieces…</div>
          ) : filtered.length === 0 ? (
            <div className="gallery-empty">
              <p>No pieces currently tagged under “{activeCategory}”.</p>
              <button
                type="button"
                className="btn btn--outline btn--sm"
                onClick={() => selectCategory('All')}
              >
                Show All Pieces
              </button>
            </div>
          ) : (
            <div
              className={`gallery-grid ${
                density === 'compact' ? 'gallery-grid--compact' : 'gallery-grid--editorial'
              }`}
            >
              {filtered.map((item, idx) => {
                const msg = `Hi Magic Touch, I'm interested in "${
                  item.title || item.alt
                }" (${item.category || 'Jewellery'}) from your website gallery.`

                return (
                  <article key={item.id} className="gallery-card">
                    <div
                      className="gallery-card__media"
                      onClick={() => setLightboxIndex(idx)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && setLightboxIndex(idx)}
                    >
                      <img src={item.thumb || item.src} alt={item.alt} loading="lazy" />
                      <div className="gallery-card__overlay">
                        <span>Click to Inspect</span>
                      </div>
                    </div>

                    <div className="gallery-card__body">
                      <div className="gallery-card__header">
                        <span className="gallery-card__cat">{item.category || 'Collection'}</span>
                        <span className="gallery-card__tag">Anti-Tarnish</span>
                      </div>
                      <h2 className="gallery-card__title">{item.title || item.alt}</h2>
                      {item.caption && <p className="gallery-card__caption">{item.caption}</p>}

                      <div className="gallery-card__footer">
                        <button
                          type="button"
                          className="gallery-card__inspect"
                          onClick={() => setLightboxIndex(idx)}
                        >
                          View Details
                        </button>
                        <a
                          href={waLink(msg)}
                          target="_blank"
                          rel="noreferrer"
                          className="gallery-card__wa"
                        >
                          Enquire on WhatsApp ↗
                        </a>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}

          {/* Custom Sourcing Callout */}
          <div className="custom-request-banner">
            <div>
              <span className="eyebrow">In-Store Collection</span>
              <h3>Looking for a specific design?</h3>
              <p>
                New pieces arrive weekly at our V.P. Road store. Message us on WhatsApp and we’ll share photos from the counter.
              </p>
            </div>
            <a
              href={waLink(
                "Hi Magic Touch, I'd like to see more designs from your store."
              )}
              target="_blank"
              rel="noreferrer"
              className="btn btn--primary"
            >
              Chat on WhatsApp ↗
            </a>
          </div>
        </div>
      </section>

      <Lightbox
        items={filtered}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onSelectIndex={setLightboxIndex}
      />
    </div>
  )
}
