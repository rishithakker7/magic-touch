import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production'
const token = import.meta.env.VITE_SANITY_TOKEN

export const isSanityConfigured = Boolean(projectId)
export const isSanityWriteConfigured = Boolean(projectId && token)

export const client = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion: '2024-10-01',
      token: token || undefined,
      useCdn: !token,
    })
  : null

const builder = client ? imageUrlBuilder(client) : null

const LOCAL_STORAGE_KEY = 'magic_touch_gallery_cms_v1'

// Initial curated pieces shown until custom photos override them in the CMS.
export const placeholders = [
  {
    id: 'p1',
    src: '/gallery/earrings.jpg',
    thumb: '/gallery/earrings.jpg',
    title: 'Noor Pearl Linear Drops',
    alt: 'Pearl drop earrings on raw linen',
    caption: 'Freshwater pearl cascade drops — 18k gold-tone anti-tarnish finish',
    category: 'Earrings',
    ratio: 1,
    featured: true,
  },
  {
    id: 'p2',
    src: '/gallery/necklace.jpg',
    thumb: '/gallery/necklace.jpg',
    title: 'Aurelia Triple-Layer Set',
    alt: 'Layered gold necklace on travertine stone',
    caption: 'Three-tier medallion & pendant layering chains — water-resistant PVD gold',
    category: 'Necklaces',
    ratio: 1,
    featured: true,
  },
  {
    id: 'p3',
    src: '/gallery/jhumka.jpg',
    thumb: '/gallery/jhumka.jpg',
    title: 'Zari Filigree Pearl Jhumkas',
    alt: 'Filigree pearl jhumka earrings on velvet',
    caption: 'Hand-set micro-pearl bell jhumkas with antique filigree stud',
    category: 'Earrings',
    ratio: 1,
    featured: true,
  },
  {
    id: 'p4',
    src: '/gallery/bangles.jpg',
    thumb: '/gallery/bangles.jpg',
    title: 'Kanak Everyday Bangle Stack',
    alt: 'Stacked hammered gold bangles',
    caption: 'Hammered & rope-textured everyday kadas — sweat and water resistant',
    category: 'Bangles',
    ratio: 1,
    featured: true,
  },
  {
    id: 'p5',
    src: '/gallery/rings.jpg',
    thumb: '/gallery/rings.jpg',
    title: 'Mira Pavé & Solitaire Trio',
    alt: 'Stackable solitaire and pavé rings on marble',
    caption: 'Bezel solitaire & micro-pavé stacking bands — tarnish-free stainless core',
    category: 'Rings',
    ratio: 1,
    featured: true,
  },
]

const query = `*[_type == "galleryImage" && defined(image.asset)] | order(order asc, _createdAt desc){
  _id, title, alt, caption, category, featured,
  "ratio": image.asset->metadata.dimensions.aspectRatio,
  image
}`

const map = (d) => ({
  id: d._id,
  title: d.title || d.alt || 'Curated Piece',
  alt: d.alt || d.title || 'Magic Touch art jewellery piece',
  caption: d.caption || '',
  category: d.category || 'Earrings',
  featured: d.featured ?? true,
  ratio: d.ratio || 1,
  src: builder.image(d.image).width(1800).auto('format').quality(85).url(),
  thumb: builder.image(d.image).width(900).auto('format').quality(80).url(),
})

export function getLocalGalleryItems() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!raw) return placeholders
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : placeholders
  } catch {
    return placeholders
  }
}

export function saveLocalGalleryItems(nextItems) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(nextItems))
    window.dispatchEvent(new CustomEvent('mt-gallery-updated'))
  } catch (err) {
    console.error('Could not save gallery items to localStorage:', err)
  }
}

export function resetLocalGalleryItems() {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY)
    window.dispatchEvent(new CustomEvent('mt-gallery-updated'))
  } catch {}
}

export async function uploadCloudGalleryItem({ fileBlob, title, category, caption, featured }) {
  if (!client || !token) {
    throw new Error('Sanity cloud credentials not configured')
  }
  const asset = await client.assets.upload('image', fileBlob, {
    filename: `${title || 'piece'}.jpg`,
  })
  const doc = await client.create({
    _type: 'galleryImage',
    title,
    alt: title,
    category,
    caption,
    featured,
    order: 1,
    image: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
    },
  })
  window.dispatchEvent(new CustomEvent('mt-gallery-updated'))
  return doc
}

export async function deleteCloudGalleryItem(id) {
  if (!client || !token || !id || id.startsWith('p') || id.startsWith('custom-')) return false
  await client.delete(id)
  window.dispatchEvent(new CustomEvent('mt-gallery-updated'))
  return true
}

export function useGallery() {
  const [items, setItems] = useState(() => (client ? null : getLocalGalleryItems()))

  const refresh = useCallback(() => {
    if (!client) {
      setItems(getLocalGalleryItems())
      return
    }
    client
      .fetch(query)
      .then((res) => setItems(res.length ? res.map(map) : getLocalGalleryItems()))
      .catch(() => setItems(getLocalGalleryItems()))
  }, [])

  useEffect(() => {
    refresh()
    window.addEventListener('mt-gallery-updated', refresh)
    return () => window.removeEventListener('mt-gallery-updated', refresh)
  }, [refresh])

  return { items: items || placeholders, loading: items === null }
}
