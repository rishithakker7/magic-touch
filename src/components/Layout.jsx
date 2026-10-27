import React, { useState, useEffect, useCallback } from 'react'
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom'
import { site, waLink, getStoreStatus } from '../data/site'
import { BrandLogo } from './Logo'

export function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const status = getStoreStatus()

  const scrollToHash = useCallback((hash) => {
    const id = hash.replace('#', '')
    if (!id) return false
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return true
    }
    return false
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    if (location.hash) {
      // Wait for target page (Home) to render in the DOM before scrolling
      const timer = setTimeout(() => {
        scrollToHash(location.hash)
      }, 40)
      return () => clearTimeout(timer)
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [location.pathname, location.hash, scrollToHash])

  const handleSectionClick = (e, hash) => {
    e.preventDefault()
    setMenuOpen(false)
    if (location.pathname === '/') {
      window.history.replaceState(null, '', `/#${hash}`)
      scrollToHash(hash)
    } else {
      navigate(`/#${hash}`)
    }
  }

  return (
    <div className="site-shell">
      {/* Top Architectural Status Bar */}
      <div className="topbar">
        <div className="container topbar__inner">
          <div className="topbar__status">
            <span
              className={`status-dot ${status.isOpen ? 'status-dot--open' : 'status-dot--closed'}`}
              aria-hidden="true"
            />
            <span>{status.label}</span>
          </div>
          <div className="topbar__links">
            <a href={site.mapsUrl} target="_blank" rel="noreferrer" className="topbar__link">
              V.P. Road, Near Lions Club, Mulund West
            </a>
            <span className="topbar__sep" aria-hidden="true">·</span>
            <a href={`tel:${site.phoneTel}`} className="topbar__link">
              {site.phoneDisplay}
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="navbar">
        <div className="container navbar__inner">
          <Link to="/" className="navbar__brand" aria-label={site.name}>
            <BrandLogo size="md" />
          </Link>

          <nav className="navbar__nav" aria-label="Primary">
            <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}>
              Home
            </NavLink>
            <NavLink to="/gallery" className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}>
              Gallery
            </NavLink>
            <a href="/#about" className="nav-link" onClick={(e) => handleSectionClick(e, 'about')}>
              About
            </a>
            <a href="/#reviews" className="nav-link" onClick={(e) => handleSectionClick(e, 'reviews')}>
              Reviews
            </a>
            <a href="/#visit" className="nav-link" onClick={(e) => handleSectionClick(e, 'visit')}>
              Visit Store
            </a>
          </nav>

          <div className="navbar__actions">
            <a
              href={waLink()}
              target="_blank"
              rel="noreferrer"
              className="btn btn--primary btn--sm navbar__cta"
            >
              WhatsApp Us ↗
            </a>
            <button
              type="button"
              className="navbar__burger"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label="Toggle navigation"
            >
              <span />
              <span />
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {menuOpen && (
          <div className="mobile-drawer">
            <div className="container mobile-drawer__inner">
              <NavLink to="/" end className="mobile-drawer__link">
                01 · Home
              </NavLink>
              <NavLink to="/gallery" className="mobile-drawer__link">
                02 · Gallery
              </NavLink>
              <a
                href="/#about"
                className="mobile-drawer__link"
                onClick={(e) => handleSectionClick(e, 'about')}
              >
                03 · About the Boutique
              </a>
              <a
                href="/#reviews"
                className="mobile-drawer__link"
                onClick={(e) => handleSectionClick(e, 'reviews')}
              >
                04 · Customer Reviews
              </a>
              <a
                href="/#visit"
                className="mobile-drawer__link"
                onClick={(e) => handleSectionClick(e, 'visit')}
              >
                05 · Store Hours &amp; Location
              </a>
              <div className="mobile-drawer__footer">
                <a href={waLink()} target="_blank" rel="noreferrer" className="btn btn--primary btn--full">
                  WhatsApp Us ({site.phoneDisplay})
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="site-main">{children}</main>

      {/* Editorial Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer__grid">
            <div className="footer__brand-col">
              <BrandLogo size="lg" />
              <p className="footer__tagline">
                A neighbourhood destination in Mulund West for anti-tarnish, water-resistant art and costume jewellery that keeps its lustre over years of wear.
              </p>
              <div className="footer__rating-badge">
                <span className="stars" aria-label="5.0 out of 5 stars">★★★★★</span>
                <span>
                  <strong>{site.rating} ★</strong> on Google ({site.reviewCount} verified reviews)
                </span>
              </div>
            </div>

            <div className="footer__col">
              <h4 className="footer__heading">Navigation</h4>
              <ul className="footer__list">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/gallery">Gallery</Link></li>
                <li><a href="/#about" onClick={(e) => handleSectionClick(e, 'about')}>About Us</a></li>
                <li><a href="/#reviews" onClick={(e) => handleSectionClick(e, 'reviews')}>Testimonials</a></li>
                <li><a href="/#visit" onClick={(e) => handleSectionClick(e, 'visit')}>Store Hours &amp; Map</a></li>
              </ul>
            </div>

            <div className="footer__col">
              <h4 className="footer__heading">Mulund West Boutique</h4>
              <address className="footer__address">
                {site.addressLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </address>
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="footer__inline-cta"
              >
                Open in Google Maps ↗
              </a>
            </div>

            <div className="footer__col">
              <h4 className="footer__heading">WhatsApp &amp; Store Hours</h4>
              <p className="footer__hours-summary">
                <strong>Tue – Sun:</strong> 11:00 AM – 7:00 / 8:00 PM
                <br />
                <strong>Monday:</strong> Closed
              </p>
              <div className="footer__contact-links">
                <a
                  href={waLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn--light-outline btn--sm"
                >
                  Chat on WhatsApp ↗
                </a>
                <a href={`tel:${site.phoneTel}`} className="footer__phone">
                  {site.phoneDisplay}
                </a>
              </div>
            </div>
          </div>

          <div className="footer__bottom">
            <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
            <div className="footer__legal">
              <Link to="/privacy">Privacy Policy</Link>
              <span>·</span>
              <Link to="/terms">Terms &amp; Conditions</Link>
              <span>·</span>
              <Link to="/studio-manager">Gallery CMS</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
