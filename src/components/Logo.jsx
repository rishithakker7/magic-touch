import React from 'react'

export function BrandLogo({ showImage = true, size = 'md' }) {
  const imgSize = size === 'lg' ? 54 : size === 'sm' ? 34 : 42

  return (
    <div className={`brand-lockup brand-lockup--${size}`}>
      {showImage && (
        <span className="brand-emblem" aria-hidden="true">
          <img
            src="/logo.png"
            alt="Magic Touch art jewellery emblem"
            width={imgSize}
            height={imgSize}
            className="brand-emblem__img"
          />
        </span>
      )}
      <div className="brand-wordmark">
        <span className="brand-wordmark__title">Magic Touch</span>
        <span className="brand-wordmark__sub">art jewellery · mulund west</span>
      </div>
    </div>
  )
}
