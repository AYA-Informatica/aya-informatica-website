import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import './AboutPage.css'
import './ProductsPage.css'

export default function ProductsPage() {
  useScrollReveal()

  useEffect(() => {
    document.title = 'Products – AYA Informatica'
  }, [])

  return (
    <>
      {/* ===================== HERO ===================== */}
      <section className="page-hero page-hero--navy" aria-label="Products page hero">
        <div className="page-hero__bg" aria-hidden="true">
          <div className="page-hero__accent-line page-hero__accent-line--1" />
          <div className="page-hero__accent-line page-hero__accent-line--2" />
        </div>
        <div className="container page-hero__content">
          <span className="section-eyebrow section-eyebrow--light reveal">Our Products</span>
          <h1 className="reveal reveal-delay-1" style={{ color: 'var(--white)' }}>
            Platforms Designed<br />
            <span style={{ color: 'var(--accent)' }}>for Real Life</span>
          </h1>
          <p className="page-hero__sub reveal reveal-delay-2">
            Each product we build is grounded in a real problem, designed for
            accessibility, and engineered to scale. We don't build apps — we build
            digital infrastructure.
          </p>
        </div>
      </section>

      {/* ===================== RAY ===================== */}
      <section className="product-detail" aria-labelledby="ray-heading">
        <div className="container product-detail__inner">
          <div className="product-detail__text reveal">
            <div className="product-detail__badge product-detail__badge--active">
              🔥 Flagship Platform
            </div>
            <h2 id="ray-heading">RAY</h2>
            <p className="product-detail__tagline">
              Rwanda's mobile-first marketplace for buying and selling.
            </p>
            <p>
              RAY is a mobile-first marketplace designed to simplify buying and
              selling in Rwanda, starting with phones and electronics. Built on
              trust, speed, and accessibility — RAY connects buyers and sellers
              directly and transparently.
            </p>
            <p>
              Our goal is to make RAY the default platform for everyday commerce
              in Rwanda, and eventually across the continent.
            </p>

            <div className="product-detail__pillars">
              <div className="product-detail__pillar">
                <span className="product-detail__pillar-icon" aria-hidden="true">🛡</span>
                <div>
                  <h4>Trust</h4>
                  <p>Every interaction is designed to build and preserve user trust.</p>
                </div>
              </div>
              <div className="product-detail__pillar">
                <span className="product-detail__pillar-icon" aria-hidden="true">📱</span>
                <div>
                  <h4>Accessibility</h4>
                  <p>Built mobile-first for the way people in Rwanda actually use technology.</p>
                </div>
              </div>
              <div className="product-detail__pillar">
                <span className="product-detail__pillar-icon" aria-hidden="true">⚡</span>
                <div>
                  <h4>Speed</h4>
                  <p>Fast to list, fast to connect, fast to close a deal.</p>
                </div>
              </div>
            </div>

            <Link to="/contact" className="btn btn--primary product-detail__cta">
              Get Early Access
            </Link>
          </div>

          <div className="product-detail__visual reveal reveal-delay-2" aria-hidden="true">
            <div className="ray-mockup">
              <div className="ray-mockup__phone">
                <div className="ray-mockup__screen">
                  <div className="ray-mockup__header">
                    <span className="ray-mockup__app-name">RAY</span>
                    <span className="ray-mockup__location">📍 Kigali</span>
                  </div>
                  <div className="ray-mockup__search">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M9 9l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    Search phones &amp; electronics...
                  </div>
                  <div className="ray-mockup__listings">
                    {['iPhone 14 Pro', 'Samsung S23', 'Tecno Camon 20'].map((item) => (
                      <div className="ray-mockup__listing" key={item}>
                        <div className="ray-mockup__listing-img" />
                        <div className="ray-mockup__listing-info">
                          <span className="ray-mockup__listing-title">{item}</span>
                          <span className="ray-mockup__listing-price">RWF ••••••</span>
                          <span className="ray-mockup__listing-tag">Verified Seller</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="ray-mockup__post-btn">+ Post Item</div>
                </div>
              </div>
              <div className="ray-mockup__glow" />
            </div>
          </div>
        </div>
      </section>

      {/* ===================== RAY FEATURES ===================== */}
      <section className="product-features product-features--light" aria-labelledby="ray-features-heading">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-eyebrow">RAY – Key Features</span>
            <h2 id="ray-features-heading">What Makes RAY Different</h2>
          </div>
          <div className="product-features__grid">
            {[
              { title: 'Quick Listings', desc: 'Post your items in seconds. Simple forms, fast uploads, immediate visibility.' },
              { title: 'Direct Connection', desc: 'Connect directly with buyers or sellers — no middlemen, no hidden fees.' },
              { title: 'Transparent Pricing', desc: 'Negotiate prices openly and transparently. What you see is what you get.' },
              { title: 'Wider Market', desc: 'Access a wider, more active market than local classifieds or social groups.' },
              { title: 'Trust-First Design', desc: 'Every feature is built with trust mechanisms — verified sellers, safe messaging.' },
              { title: 'Mobile-First', desc: 'Optimized for mobile use — the way most Rwandans access the internet.' },
            ].map((feat, i) => (
              <article
                className={`feature-card reveal reveal-delay-${(i % 3) + 1}`}
                key={feat.title}
              >
                <div className="feature-card__accent" aria-hidden="true" />
                <h4>{feat.title}</h4>
                <p>{feat.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== HUMURA ===================== */}
      <section className="product-detail product-detail--humura" aria-labelledby="humura-heading">
        <div className="container product-detail__inner product-detail__inner--reversed">
          <div className="product-detail__visual product-detail__visual--humura reveal" aria-hidden="true">
            <div className="humura-visual">
              <div className="humura-visual__circle humura-visual__circle--1" />
              <div className="humura-visual__circle humura-visual__circle--2" />
              <div className="humura-visual__circle humura-visual__circle--3" />
              <div className="humura-visual__center">
                <span>🧠</span>
                <span className="humura-visual__name">Humura</span>
                <span className="humura-visual__sub">Mental Wellness Platform</span>
              </div>
              <div className="humura-visual__tags">
                <span>Safe Space</span>
                <span>Anonymous</span>
                <span>Support</span>
                <span>Wellbeing</span>
              </div>
            </div>
          </div>

          <div className="product-detail__text reveal reveal-delay-1">
            <div className="product-detail__badge product-detail__badge--upcoming">
              🧠 Upcoming Platform
            </div>
            <h2 id="humura-heading">Humura</h2>
            <p className="product-detail__tagline">
              Mental wellness and emotional support — for Africa.
            </p>
            <p>
              Humura is a digital platform focused on mental wellness and emotional
              support. It is designed to provide safe and anonymous access to support,
              human-centered experiences, and a trusted digital environment for
              personal wellbeing.
            </p>
            <p>
              Humura reflects our commitment to building not only powerful systems
              but meaningful ones — platforms that matter to the people who use them.
            </p>

            <div className="humura-features">
              {[
                'Safe & anonymous access to support',
                'Human-centered UX',
                'Trusted digital environment',
                'Personal wellbeing focus',
              ].map((f) => (
                <div className="humura-feature" key={f}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <circle cx="8" cy="8" r="7" stroke="var(--accent)" strokeWidth="1.5"/>
                    <path d="M5 8l2 2 4-4" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {f}
                </div>
              ))}
            </div>

            <Link to="/contact" className="btn btn--outline-dark product-detail__cta">
              Stay Updated on Humura
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== ROADMAP TEASER ===================== */}
      <section className="products-roadmap" aria-labelledby="ecosystem-heading">
        <div className="container">
          <div className="section-header section-header--light reveal">
            <span className="section-eyebrow section-eyebrow--light">The Vision</span>
            <h2 id="ecosystem-heading" style={{ color: 'var(--white)' }}>
              Building an Integrated<br />Digital Ecosystem
            </h2>
            <p className="section-sub" style={{ color: 'rgba(255,255,255,0.55)' }}>
              RAY and Humura are the first pieces of a larger vision — an interconnected
              ecosystem of platforms that power everyday African life.
            </p>
          </div>

          <div className="ecosystem-diagram reveal" aria-label="Ecosystem overview diagram">
            <div className="ecosystem-center">
              <span>AYA</span>
              <span>Ecosystem</span>
            </div>
            <div className="ecosystem-nodes">
              {[
                { name: 'RAY', desc: 'Commerce', active: true },
                { name: 'Humura', desc: 'Wellness', active: false },
                { name: 'Platform 3', desc: 'Coming soon', active: false },
                { name: 'Platform 4', desc: 'Coming soon', active: false },
              ].map((node) => (
                <div
                  className={`ecosystem-node${node.active ? ' ecosystem-node--active' : ''}`}
                  key={node.name}
                >
                  <span className="ecosystem-node__name">{node.name}</span>
                  <span className="ecosystem-node__desc">{node.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-banner" aria-label="Products CTA">
        <div className="container cta-banner__inner reveal">
          <div className="cta-banner__text">
            <h2>Interested in Our Platforms?</h2>
            <p>Reach out to partner with us or get early access to our products.</p>
          </div>
          <div className="cta-banner__actions">
            <Link to="/contact" className="btn btn--primary">Contact Us</Link>
            <Link to="/services" className="btn btn--outline-dark">See Services</Link>
          </div>
        </div>
      </section>
    </>
  )
}
