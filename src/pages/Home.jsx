import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { site, waLink, getStoreStatus } from '../data/site'
import { useGallery } from '../lib/gallery'
import { Lightbox } from '../components/Lightbox'

function GoogleGIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
      />
    </svg>
  )
}

function ReviewCard({ rev }) {
  const [expanded, setExpanded] = useState(false)
  const isLong = rev.text.length > 110
  const displayedText =
    !isLong || expanded ? rev.text : `${rev.text.slice(0, 105).trim()}...`

  return (
    <article className="g-review-card">
      <div className="g-review-card__head">
        <div className="g-review-card__user">
          <span
            className="g-review-card__avatar"
            style={{ backgroundColor: rev.color || '#6d597a' }}
            aria-hidden="true"
          >
            {rev.initial}
          </span>
          <strong className="g-review-card__name">{rev.author}</strong>
        </div>
        <GoogleGIcon size={18} />
      </div>

      <div className="g-review-card__rating-row">
        <span className="g-stars" aria-label="5 out of 5 stars">
          ★★★★★
        </span>
        <span className="g-review-card__date">{rev.date}</span>
      </div>

      <p className="g-review-card__text">
        {displayedText}{' '}
        {isLong && (
          <button
            type="button"
            className="g-review-card__more"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </p>
    </article>
  )
}

export function Home() {
  const { items } = useGallery()
  const featuredItems = items.filter((i) => i.featured !== false).slice(0, 3)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const status = getStoreStatus()

  return (
    <>
      {/* Editorial Hero */}
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__content">
            <div className="hero__kicker">
              <span className="eyebrow">Mulund West, Mumbai</span>
            </div>

            <h1 className="hero__title">
              Magic Touch <em>art jewellery</em>
            </h1>

            <p className="hero__lead">
              Everyday luxury crafted to keep its shine, year after year.
            </p>

            <div className="hero__actions">
              <a
                href={waLink()}
                target="_blank"
                rel="noreferrer"
                className="btn btn--primary"
              >
                Enquire on WhatsApp ↗
              </a>
              <Link to="/gallery" className="btn btn--outline">
                Explore the Gallery
              </Link>
            </div>

            <div className="hero__metrics">
              <div className="hero__metric">
                <span className="hero__metric-val">{site.rating} ★</span>
                <span className="hero__metric-label">Google Reviews</span>
              </div>
              <div className="hero__metric">
                <span className="hero__metric-val">Anti-Tarnish</span>
                <span className="hero__metric-label">Water-Resistant</span>
              </div>
              <div className="hero__metric">
                <span className="hero__metric-val">Mulund (W)</span>
                <span className="hero__metric-label">V.P. Road</span>
              </div>
            </div>
          </div>

          <div className="hero__visuals">
            <div className="hero__primary-frame">
              <img
                src="/gallery/necklace.jpg"
                alt="Layered gold necklaces at Magic Touch art jewellery"
                className="hero__img-main"
              />
            </div>

            <div className="hero__secondary-card">
              <img
                src="/gallery/jhumka.jpg"
                alt="Pearl jhumka earrings"
                className="hero__img-inset"
              />
              <div className="hero__secondary-text">
                <span className="eyebrow">Festive &amp; Daily</span>
                <p>Pearl jhumkas, chains, bangles &amp; rings</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Uniform 3-Item Promise Strip */}
      <div className="promise-ribbon" aria-label="Store highlights">
        <div className="container promise-ribbon__inner">
          <span>✦ Water-Resistant &amp; Sweat-Proof Finishes</span>
          <span>✦ Tarnish-Free Everyday &amp; Festive Jewellery</span>
          <span>✦ Proven 3+ Year Shine by Local Clients</span>
        </div>
      </div>

      {/* Collection Preview -> Links to /gallery */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Our Collection</span>
              <h2 className="section-title">Browse by category</h2>
            </div>
            <Link to="/gallery" className="btn btn--primary btn--sm">
              Open Full Gallery ({items.length}) →
            </Link>
          </div>

          <div className="category-grid">
            {[
              {
                name: 'Earrings',
                subtitle: 'Pearl drops, studs & jhumkas',
                img: '/gallery/earrings.jpg',
                tag: 'Daily & Festive',
              },
              {
                name: 'Necklaces',
                subtitle: 'Layered chains & pendants',
                img: '/gallery/necklace.jpg',
                tag: 'Water-Resistant',
              },
              {
                name: 'Bangles',
                subtitle: 'Hammered kadas & cuffs',
                img: '/gallery/bangles.jpg',
                tag: 'Anti-Tarnish',
              },
              {
                name: 'Rings',
                subtitle: 'Solitaires & stacking bands',
                img: '/gallery/rings.jpg',
                tag: 'Tarnish-Free',
              },
            ].map((cat) => (
              <Link
                to={`/gallery?category=${encodeURIComponent(cat.name)}`}
                key={cat.name}
                className="category-card"
              >
                <div className="category-card__media">
                  <img src={cat.img} alt={cat.name} loading="lazy" />
                  <span className="category-card__badge">{cat.tag}</span>
                </div>
                <div className="category-card__body">
                  <div className="category-card__row">
                    <h3>{cat.name}</h3>
                    <span aria-hidden="true">↗</span>
                  </div>
                  <p>{cat.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section section--stone">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">About {site.name}</span>
              <h2 className="section-title">Jewellery that doesn’t lose its lustre</h2>
            </div>
          </div>

          <div className="pillars-grid">
            {site.pillars.map((pillar) => (
              <article key={pillar.num} className="pillar-card">
                <span className="pillar-card__num">{pillar.num}</span>
                <h3 className="pillar-card__title">{pillar.title}</h3>
                <p className="pillar-card__body">{pillar.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Authentic Google Reviews Widget Section */}
      <section id="reviews" className="section">
        <div className="container">
          <div className="g-reviews-header">
            <div className="g-reviews-header__title-row">
              <GoogleGIcon size={24} />
              <h2 className="g-reviews-heading">Google reviews</h2>
            </div>
            <div className="g-reviews-header__summary">
              <strong className="g-reviews-score">{site.rating}</strong>
              <span className="g-stars" aria-label="5.0 out of 5 stars">
                ★★★★★
              </span>
              <span className="g-reviews-count">{site.reviewCount} reviews</span>
            </div>
          </div>

          <div className="g-reviews-grid">
            {site.reviews.map((rev) => (
              <ReviewCard key={rev.author} rev={rev} />
            ))}
          </div>

          <div className="g-reviews-footer">
            <a
              href={site.reviewsUrl}
              target="_blank"
              rel="noreferrer"
              className="g-reviews-btn"
            >
              <GoogleGIcon size={16} />
              <span>Read all reviews on Google</span>
            </a>
          </div>
        </div>
      </section>

      {/* Storefront Location, Hours & Side-by-Side Buttons */}
      <section id="visit" className="section">
        <div className="container">
          <div className="visit-header">
            <span className="eyebrow">Visit &amp; Contact</span>
            <h2 className="section-title">Visit our Mulund West shop</h2>
            <p className="visit-ledger__desc">
              Find us at <strong>Arihant Darshan, V.P. Road</strong> (near Lions Club), or message us on WhatsApp for pricing and availability.
            </p>
          </div>

          <div className="visit-ledger">
            <div className="visit-ledger__info">
              <div className="visit-details-box">
                <div className="visit-detail">
                  <span className="visit-detail__label">Address</span>
                  <p>
                    Arihant Darshan, V.P. Road, near Lions Club
                    <br />
                    Mulund West, Mumbai, Maharashtra 400080
                  </p>
                </div>
                <div className="visit-detail">
                  <span className="visit-detail__label">Phone &amp; WhatsApp</span>
                  <p>
                    <a href={waLink()} target="_blank" rel="noreferrer">
                      {site.phoneDisplay}
                    </a>
                  </p>
                </div>
              </div>

              <div className="hours-table" aria-label="Weekly opening hours">
                <div className="hours-table__header">
                  <span>Opening Hours</span>
                  <span className={`hours-badge ${status.isOpen ? 'hours-badge--open' : ''}`}>
                    {status.isOpen ? 'Open Now' : 'Currently Closed'}
                  </span>
                </div>
                {site.hours.map((h, i) => {
                  const isToday = i === status.dayIndex
                  return (
                    <div
                      key={h.day}
                      className={`hours-row ${isToday ? 'hours-row--today' : ''} ${
                        h.open === null ? 'hours-row--closed' : ''
                      }`}
                    >
                      <span>
                        {h.day} {isToday && <em>(Today)</em>}
                      </span>
                      <span>{h.time}</span>
                    </div>
                  )
                })}
              </div>

              <div className="visit-ledger__cta">
                <a
                  href={waLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn--primary"
                >
                  Chat on WhatsApp ↗
                </a>
                <a
                  href={site.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn--outline"
                >
                  Directions on Google Maps
                </a>
              </div>
            </div>

            <div className="visit-ledger__map">
              <div className="map-frame">
                <iframe
                  title="Magic Touch art jewellery location in Mulund West, Mumbai"
                  src={site.mapsEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="map-caption">
                <span>📍 Arihant Darshan, V.P. Road, near Lions Club, Mulund West</span>
                <a href={site.mapsUrl} target="_blank" rel="noreferrer">
                  Open in Google Maps ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Lightbox
        items={featuredItems}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onSelectIndex={setLightboxIndex}
      />
    </>
  )
}
