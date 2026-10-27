import React, { useEffect } from 'react'
import { waLink } from '../data/site'

export function Lightbox({ items, activeIndex, onClose, onSelectIndex }) {
  const item = activeIndex !== null && items[activeIndex] ? items[activeIndex] : null

  useEffect(() => {
    if (!item) return
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onSelectIndex((activeIndex + 1) % items.length)
      if (e.key === 'ArrowLeft') onSelectIndex((activeIndex - 1 + items.length) % items.length)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [item, activeIndex, items.length, onClose, onSelectIndex])

  if (!item) return null

  const enquiryText = `Hi Magic Touch, I saw "${item.title || item.alt}" (${item.category || 'Jewellery'}) in your online gallery and would like to check availability and price.`

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={item.title || item.alt}>
      <div className="lightbox__backdrop" onClick={onClose} />
      <div className="lightbox__sheet">
        <button type="button" className="lightbox__close" onClick={onClose} aria-label="Close preview">
          <span>Close</span>
          <span aria-hidden="true">✕</span>
        </button>

        <div className="lightbox__media">
          <img src={item.src} alt={item.alt} className="lightbox__img" />
          {items.length > 1 && (
            <div className="lightbox__nav">
              <button
                type="button"
                className="lightbox__arrow"
                onClick={() => onSelectIndex((activeIndex - 1 + items.length) % items.length)}
                aria-label="Previous piece"
              >
                ← Prev
              </button>
              <span className="lightbox__counter">
                {String(activeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
              </span>
              <button
                type="button"
                className="lightbox__arrow"
                onClick={() => onSelectIndex((activeIndex + 1) % items.length)}
                aria-label="Next piece"
              >
                Next →
              </button>
            </div>
          )}
        </div>

        <div className="lightbox__meta">
          <div className="lightbox__meta-top">
            <span className="eyebrow">{item.category || 'Signature Collection'}</span>
            <h3 className="lightbox__title">{item.title || item.alt}</h3>
            {item.caption && <p className="lightbox__caption">{item.caption}</p>}

            <div className="lightbox__specs">
              <div className="lightbox__spec-row">
                <span>Finish</span>
                <strong>Anti-Tarnish &amp; Water-Resistant</strong>
              </div>
              <div className="lightbox__spec-row">
                <span>Availability</span>
                <strong>In-Store at Mulund West &amp; WhatsApp Hold</strong>
              </div>
              <div className="lightbox__spec-row">
                <span>Boutique</span>
                <strong>Arihant Darshan, V.P. Road, Mulund West</strong>
              </div>
            </div>
          </div>

          <div className="lightbox__actions">
            <a
              href={waLink(enquiryText)}
              target="_blank"
              rel="noreferrer"
              className="btn btn--primary btn--full"
            >
              Enquire on WhatsApp
            </a>
            <p className="lightbox__note">
              Looking for matching bangles, earrings, or bridal sets? Message us on WhatsApp or visit our V.P. Road boutique.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
