import React from 'react'
import { site } from '../data/site'

export function Privacy() {
  return (
    <section className="section">
      <div className="container legal-container">
        <span className="eyebrow">Legal · {site.name}</span>
        <h1 className="page-title">Privacy Policy</h1>
        <p className="legal-updated">Last updated: {new Date().getFullYear()}</p>

        <div className="legal-prose">
          <p>
            <strong>{site.name}</strong> (“we”, “our”, or “us”), located at{' '}
            {site.addressSingleLine}, respects your privacy and is committed to protecting any personal information you share with us.
          </p>

          <h3>1. Information You Share With Us</h3>
          <p>
            Our website is an informational catalogue and gallery. We do not require you to create an account or enter payment card details on this website. When you click to call us or message us via WhatsApp ({site.phoneDisplay}), we receive your phone number, name, and the enquiry details you choose to share.
          </p>

          <h3>2. How We Use Your Information</h3>
          <p>
            We use your contact details solely to respond to your product enquiries, share photographs or availability from our Mulund West store counter, and coordinate in-store pickups or orders. We never sell or rent your phone number or personal information to third parties.
          </p>

          <h3>3. Embedded Maps &amp; Third-Party Links</h3>
          <p>
            Our website embeds Google Maps to help you locate our store on V.P. Road, Mulund West, and links to WhatsApp and Google Reviews. Use of those services is governed by their respective privacy policies.
          </p>

          <h3>4. Contact Us</h3>
          <p>
            For any privacy-related questions, please visit us at {site.addressSingleLine} or call{' '}
            <a href={`tel:${site.phoneTel}`}>{site.phoneDisplay}</a>.
          </p>
        </div>
      </div>
    </section>
  )
}

export function Terms() {
  return (
    <section className="section">
      <div className="container legal-container">
        <span className="eyebrow">Legal · {site.name}</span>
        <h1 className="page-title">Terms &amp; Conditions</h1>
        <p className="legal-updated">Last updated: {new Date().getFullYear()}</p>

        <div className="legal-prose">
          <p>
            Welcome to the official website of <strong>{site.name}</strong> ({site.addressSingleLine}). By browsing this website, you agree to the following terms.
          </p>

          <h3>1. Product Display &amp; Availability</h3>
          <p>
            Our gallery displays curated examples of our costume and anti-tarnish art jewellery collection, including earrings, jhumkas, necklaces, bangles, and rings. Because our in-store inventory refreshes weekly, availability of specific designs is subject to stock at our Mulund West boutique.
          </p>

          <h3>2. Colours &amp; Finishes</h3>
          <p>
            We strive to display product finishes accurately. Slight variations may occur due to lighting or device screen settings. We encourage visiting our boutique or requesting a live counter video via WhatsApp before purchasing.
          </p>

          <h3>3. Anti-Tarnish &amp; Care</h3>
          <p>
            Our anti-tarnish and water-resistant pieces are crafted for long-lasting shine under normal daily wear. Proper care and storage away from harsh chemicals will further extend the life of your jewellery.
          </p>

          <h3>4. Store Contact</h3>
          <p>
            <strong>{site.name}</strong>
            <br />
            {site.addressSingleLine}
            <br />
            Phone / WhatsApp: <a href={`tel:${site.phoneTel}`}>{site.phoneDisplay}</a>
          </p>
        </div>
      </div>
    </section>
  )
}
