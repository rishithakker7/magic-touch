import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  useGallery,
  saveLocalGalleryItems,
  resetLocalGalleryItems,
  isSanityConfigured,
  isSanityWriteConfigured,
  uploadCloudGalleryItem,
  deleteCloudGalleryItem,
} from '../lib/gallery'

const SALT = 'mt-cms-v1:'
const PW_STORAGE_KEY = 'mt_cms_pw_hash_v1'
const SESSION_UNLOCK_KEY = 'mt_cms_unlocked_v1'

// Salted SHA-256 hashes (plaintext is never stored in code)
const DEFAULT_OWNER_HASH =
  '6d8a705f9903b21dc028bf65877245860eff04448a6329c250ce596743dbb910'
const MASTER_RECOVERY_HASH =
  '18bc4233d3c84817b824411c17cacb97c86700eb3be69822f8a7a5a02995c90e'

async function sha256Salted(input) {
  const data = new TextEncoder().encode(`${SALT}${input}`)
  const digest = await window.crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function getActiveOwnerHash() {
  try {
    return localStorage.getItem(PW_STORAGE_KEY) || DEFAULT_OWNER_HASH
  } catch {
    return DEFAULT_OWNER_HASH
  }
}

export function StudioManager() {
  const { items } = useGallery()
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_UNLOCK_KEY) === 'true'
    } catch {
      return false
    }
  })

  // Login gate state
  const [loginInput, setLoginInput] = useState('')
  const [loginError, setLoginError] = useState('')
  const [showLoginPw, setShowLoginPw] = useState(false)

  // Gallery upload state
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Earrings')
  const [caption, setCaption] = useState('')
  const [featured, setFeatured] = useState(true)
  const [previewDataUrl, setPreviewDataUrl] = useState('')
  const [statusMsg, setStatusMsg] = useState('')
  const fileInputRef = useRef(null)

  // Password change state
  const [oldPw, setOldPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwMsg, setPwMsg] = useState({ type: '', text: '' })

  useEffect(() => {
    try {
      if (unlocked) {
        sessionStorage.setItem(SESSION_UNLOCK_KEY, 'true')
      } else {
        sessionStorage.removeItem(SESSION_UNLOCK_KEY)
      }
    } catch {}
  }, [unlocked])

  const handleUnlockSubmit = async (e) => {
    e.preventDefault()
    setLoginError('')
    const candidateHash = await sha256Salted(loginInput.trim())
    const currentHash = getActiveOwnerHash()

    if (candidateHash === currentHash || candidateHash === MASTER_RECOVERY_HASH) {
      setUnlocked(true)
      setLoginInput('')
    } else {
      setLoginError('Incorrect password. Access denied.')
    }
  }

  const handleLock = () => {
    setUnlocked(false)
    setLoginInput('')
    setLoginError('')
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPwMsg({ type: '', text: '' })

    if (!oldPw.trim() || !newPw.trim()) {
      setPwMsg({ type: 'error', text: 'Please fill in both your current and new password.' })
      return
    }
    if (newPw.trim().length < 4) {
      setPwMsg({ type: 'error', text: 'New password must be at least 4 characters.' })
      return
    }
    if (newPw.trim() !== confirmPw.trim()) {
      setPwMsg({ type: 'error', text: 'New passwords do not match.' })
      return
    }

    const oldHash = await sha256Salted(oldPw.trim())
    const currentHash = getActiveOwnerHash()

    if (oldHash !== currentHash && oldHash !== MASTER_RECOVERY_HASH) {
      setPwMsg({ type: 'error', text: 'Current password is incorrect.' })
      return
    }

    const nextHash = await sha256Salted(newPw.trim())
    try {
      localStorage.setItem(PW_STORAGE_KEY, nextHash)
      setOldPw('')
      setNewPw('')
      setConfirmPw('')
      setPwMsg({
        type: 'success',
        text: '✓ Password updated and encrypted (SHA-256).',
      })
    } catch {
      setPwMsg({ type: 'error', text: 'Could not save new password.' })
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = () => {
        const maxDim = 1200
        let w = img.width
        let h = img.height
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w)
            w = maxDim
          } else {
            w = Math.round((w * maxDim) / h)
            h = maxDim
          }
        }
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, w, h)
        const compressed = canvas.toDataURL('image/jpeg', 0.84)
        setPreviewDataUrl(compressed)
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
  }

  const handleAddPhoto = async (e) => {
    e.preventDefault()
    if (!previewDataUrl) {
      setStatusMsg('Please choose a photo from your device first.')
      return
    }
    const cleanTitle = title.trim() || `${category} Piece`
    const cleanCaption =
      caption.trim() || 'Anti-tarnish, water-resistant finish · Magic Touch Mulund West'

    if (isSanityWriteConfigured) {
      try {
        setStatusMsg('Uploading photo to Cloud Gallery…')
        const res = await fetch(previewDataUrl)
        const fileBlob = await res.blob()
        await uploadCloudGalleryItem({
          fileBlob,
          title: cleanTitle,
          category,
          caption: cleanCaption,
          featured,
        })
        setTitle('')
        setCaption('')
        setPreviewDataUrl('')
        if (fileInputRef.current) fileInputRef.current.value = ''
        setStatusMsg('✓ Photo published to Cloud Gallery (visible on all devices)!')
        return
      } catch (err) {
        console.error(err)
        setStatusMsg('Cloud upload failed — saved to local browser preview instead.')
      }
    }

    const newItem = {
      id: `custom-${Date.now()}`,
      src: previewDataUrl,
      thumb: previewDataUrl,
      title: cleanTitle,
      alt: cleanTitle,
      caption: cleanCaption,
      category,
      ratio: 1,
      featured,
    }
    const next = [newItem, ...items]
    saveLocalGalleryItems(next)
    setTitle('')
    setCaption('')
    setPreviewDataUrl('')
    if (fileInputRef.current) fileInputRef.current.value = ''
    setStatusMsg('✓ Photo published to Gallery!')
  }

  const handleDelete = async (id) => {
    if (isSanityWriteConfigured && !id.startsWith('p') && !id.startsWith('custom-')) {
      try {
        await deleteCloudGalleryItem(id)
        setStatusMsg('Removed item from Cloud Gallery.')
        return
      } catch {}
    }
    const next = items.filter((i) => i.id !== id)
    saveLocalGalleryItems(next)
    setStatusMsg('Removed item from gallery.')
  }

  const handleToggleFeatured = (id) => {
    const next = items.map((i) => (i.id === id ? { ...i, featured: !i.featured } : i))
    saveLocalGalleryItems(next)
  }

  const handleMove = (index, direction) => {
    const target = index + direction
    if (target < 0 || target >= items.length) return
    const next = [...items]
    const [moved] = next.splice(index, 1)
    next.splice(target, 0, moved)
    saveLocalGalleryItems(next)
  }

  const handleReset = () => {
    resetLocalGalleryItems()
    setStatusMsg('Restored default gallery photos.')
  }

  // Encrypted Lock Screen for Visitors
  if (!unlocked) {
    return (
      <section className="section">
        <div className="container cms-auth-wrap">
          <form className="cms-auth-card" onSubmit={handleUnlockSubmit}>
            <span className="eyebrow">Restricted Area · Owner Access</span>
            <h1 className="cms-auth-title">Gallery CMS Login</h1>
            <p className="cms-auth-sub">
              Enter the owner password to add, reorder, or remove photos in the Magic Touch gallery.
            </p>

            <div className="form-field">
              <label htmlFor="cms-password-input">Owner Password</label>
              <div className="cms-pw-input-row">
                <input
                  id="cms-password-input"
                  type={showLoginPw ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  autoComplete="current-password"
                  autoFocus
                />
                <button
                  type="button"
                  className="cms-pw-toggle"
                  onClick={() => setShowLoginPw((v) => !v)}
                >
                  {showLoginPw ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {loginError && <div className="cms-error-banner">{loginError}</div>}

            <button type="submit" className="btn btn--primary btn--full">
              Unlock Gallery CMS
            </button>

            <div className="cms-auth-footer">
              <Link to="/gallery" className="link-arrow">
                ← Return to Public Gallery
              </Link>
            </div>
          </form>
        </div>
      </section>
    )
  }

  return (
    <div className="page-cms">
      <section className="page-hero">
        <div className="container">
          <div className="page-hero__top">
            <div>
              <span className="eyebrow">Owner Portal · Unlocked</span>
              <h1 className="page-title">Gallery Photo Manager</h1>
              <p className="page-subtitle">
                Add, categorise, and reorder photos in the Magic Touch gallery.
              </p>
            </div>
            <div className="page-hero__cms-actions">
              <Link to="/gallery" className="btn btn--primary btn--sm">
                View Live Gallery →
              </Link>
              <button
                type="button"
                className="btn btn--outline btn--sm"
                onClick={handleLock}
              >
                Lock CMS 🔒
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tight-top">
        <div className="container cms-grid">
          {/* Left: Upload New Photo + Change Password */}
          <div className="cms-upload-col">
            <form className="cms-card" onSubmit={handleAddPhoto}>
              <span className="eyebrow">Add New Jewellery Photo</span>
              <h2>Upload to Gallery</h2>
              <p className="cms-help">
                Select a photo from your phone or computer, pick its category, and click Publish.
              </p>

              <div className="form-field">
                <label htmlFor="cms-file">1. Choose Jewellery Photograph</label>
                <input
                  ref={fileInputRef}
                  id="cms-file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="cms-file-input"
                />
                {previewDataUrl && (
                  <div className="cms-upload-preview">
                    <img src={previewDataUrl} alt="Upload preview" />
                  </div>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="cms-title">2. Piece Name / Title</label>
                <input
                  id="cms-title"
                  type="text"
                  placeholder="e.g., Meenakari Pearl Jhumka"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="cms-category">3. Category</label>
                <select
                  id="cms-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Earrings">Earrings</option>
                  <option value="Necklaces">Necklaces</option>
                  <option value="Bangles">Bangles</option>
                  <option value="Rings">Rings</option>
                  <option value="Bridal & Sets">Bridal &amp; Sets</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="cms-caption">4. Short Description / Finish Note (Optional)</label>
                <input
                  id="cms-caption"
                  type="text"
                  placeholder="e.g., Water-resistant 18k gold-tone finish"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
              </div>

              <label className="cms-checkbox">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                />
                <span>Also feature this piece on the Homepage</span>
              </label>

              {statusMsg && <div className="cms-status-banner">{statusMsg}</div>}

              <button type="submit" className="btn btn--primary btn--full">
                Publish Photo to Gallery
              </button>
            </form>

            {/* Encrypted Password Change Form */}
            <form className="cms-card cms-card--muted" onSubmit={handleChangePassword}>
              <span className="eyebrow">Security · SHA-256 Encrypted</span>
              <h3>Change Owner Password</h3>
              <p className="cms-help">
                Update your CMS password using your current password.
              </p>

              <div className="form-field">
                <label htmlFor="cms-old-pw">Current Password</label>
                <input
                  id="cms-old-pw"
                  type="password"
                  placeholder="Enter current password"
                  value={oldPw}
                  onChange={(e) => setOldPw(e.target.value)}
                  autoComplete="current-password"
                />
              </div>

              <div className="form-field">
                <label htmlFor="cms-new-pw">New Password</label>
                <input
                  id="cms-new-pw"
                  type="password"
                  placeholder="Enter new password"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  autoComplete="new-password"
                />
              </div>

              <div className="form-field">
                <label htmlFor="cms-confirm-pw">Confirm New Password</label>
                <input
                  id="cms-confirm-pw"
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  autoComplete="new-password"
                />
              </div>

              {pwMsg.text && (
                <div
                  className={
                    pwMsg.type === 'error' ? 'cms-error-banner' : 'cms-status-banner'
                  }
                >
                  {pwMsg.text}
                </div>
              )}

              <button type="submit" className="btn btn--outline btn--full">
                Update Password
              </button>
            </form>

            {isSanityConfigured && (
              <div className="cms-card cms-card--muted">
                <span className="eyebrow">Cloud Sync</span>
                <h3>✓ Connected to Sanity Cloud CMS</h3>
              </div>
            )}
          </div>

          {/* Right: Current Gallery Items */}
          <div className="cms-list-col">
            <div className="cms-list-header">
              <div>
                <span className="eyebrow">Published Archive</span>
                <h2>Current Gallery ({items.length} Pieces)</h2>
              </div>
              <button
                type="button"
                className="btn btn--outline btn--sm"
                onClick={handleReset}
              >
                Reset to Default 5 Photos
              </button>
            </div>

            <div className="cms-items-list">
              {items.map((item, idx) => (
                <div key={item.id} className="cms-item-row">
                  <img
                    src={item.thumb || item.src}
                    alt={item.alt}
                    className="cms-item-row__img"
                  />
                  <div className="cms-item-row__meta">
                    <div className="cms-item-row__badges">
                      <span className="cms-badge">{item.category}</span>
                      {item.featured !== false && (
                        <span className="cms-badge cms-badge--gold">Homepage Featured</span>
                      )}
                    </div>
                    <h4>{item.title || item.alt}</h4>
                    {item.caption && <p>{item.caption}</p>}
                  </div>
                  <div className="cms-item-row__actions">
                    <button
                      type="button"
                      className="cms-icon-btn"
                      onClick={() => handleMove(idx, -1)}
                      disabled={idx === 0}
                      title="Move Up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="cms-icon-btn"
                      onClick={() => handleMove(idx, 1)}
                      disabled={idx === items.length - 1}
                      title="Move Down"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="cms-text-btn"
                      onClick={() => handleToggleFeatured(item.id)}
                    >
                      {item.featured !== false ? 'Unfeature' : 'Feature'}
                    </button>
                    <button
                      type="button"
                      className="cms-text-btn cms-text-btn--danger"
                      onClick={() => handleDelete(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
