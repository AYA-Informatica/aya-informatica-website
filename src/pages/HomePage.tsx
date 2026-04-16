import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import './HomePage.css'

export default function HomePage() {
  useScrollReveal()

  /* Re-trigger reveal after mount since hook runs once */
  useEffect(() => {
    const timeout = setTimeout(() => {
      const elements = document.querySelectorAll('.reveal')
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight * 0.9) {
          el.classList.add('visible')
        }
      })
    }, 100)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <>
      {/* ===================== HERO ===================== */}
      <section className="hero" aria-label="Hero section">
        {/* Background geometric decoration */}
        <div className="hero__bg" aria-hidden="true">
          <div className="hero__bg-circle hero__bg-circle--1" />
          <div className="hero__bg-circle hero__bg-circle--2" />
          <div className="hero__bg-grid" />
        </div>

        <div className="container hero__content">
          <div className="hero__badge reveal">
            <span className="hero__badge-dot" aria-hidden="true" />
            Kigali, Rwanda — Building For Africa
          </div>

          <h1 className="hero__headline reveal reveal-delay-1">
            Building Africa's<br />
            <span className="hero__headline-accent">Digital Future</span>
          </h1>

          <p className="hero__subline reveal reveal-delay-2">
            AYA Informatica designs and deploys innovative platforms that simplify
            commerce, enhance human connection, and unlock economic opportunity
            across the continent.
          </p>

          <div className="hero__actions reveal reveal-delay-3">
            <Link to="/products" className="btn btn--primary hero__btn-primary">
              Explore Our Products
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link to="/about" className="btn btn--outline">Learn Our Story</Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero__scroll-hint" aria-hidden="true">
          <div className="hero__scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* ===================== STATS STRIP ===================== */}
      <section className="stats-strip" aria-label="Company highlights">
        <div className="container stats-strip__inner">
          {[
            { value: '3', label: 'Core Product Pillars' },
            { value: '2+', label: 'Digital Platforms' },
            { value: '1', label: 'Active Market: Rwanda' },
            { value: '∞', label: 'Ambition: All Africa' },
          ].map((stat) => (
            <div className="stats-strip__item reveal" key={stat.label}>
              <span className="stats-strip__value">{stat.value}</span>
              <span className="stats-strip__label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== PILLARS ===================== */}
      <section className="pillars" aria-labelledby="pillars-heading">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-eyebrow">What We Do</span>
            <h2 id="pillars-heading">Three Pillars.<br />One Mission.</h2>
            <p className="section-sub">
              We operate at the intersection of commerce, technology, and human experience —
              building systems designed to grow with Africa.
            </p>
          </div>

          <div className="pillars__grid">
            {[
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                    <rect x="2" y="2" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <rect x="16" y="2" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <rect x="2" y="16" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M16 21h6M21 16v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ),
                title: 'Platform Development',
                desc: 'We build scalable digital platforms that connect users, facilitate transactions, and enable new forms of economic activity.',
                link: '/services',
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                    <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="2"/>
                    <path d="M9 14l3.5 3.5L19 10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                title: 'Intelligent Systems',
                desc: 'We design systems that leverage data and modern technology to improve efficiency, decision-making, and user experience.',
                link: '/services',
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                    <path d="M4 22V10l10-6 10 6v12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                    <rect x="10" y="14" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                ),
                title: 'Digital Solutions',
                desc: 'We provide tailored software solutions for businesses seeking to modernize and scale their operations across Africa.',
                link: '/services',
              },
            ].map((pillar, i) => (
              <article
                className={`pillars__card reveal reveal-delay-${i + 1}`}
                key={pillar.title}
              >
                <div className="pillars__card-icon">{pillar.icon}</div>
                <h3>{pillar.title}</h3>
                <p>{pillar.desc}</p>
                <Link to={pillar.link} className="pillars__card-link" aria-label={`Learn more about ${pillar.title}`}>
                  Learn more
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== PRODUCTS PREVIEW ===================== */}
      <section className="products-preview" aria-labelledby="products-heading">
        <div className="container">
          <div className="section-header section-header--light reveal">
            <span className="section-eyebrow section-eyebrow--light">Our Products</span>
            <h2 id="products-heading" style={{ color: 'var(--white)' }}>
              Platforms Built<br />for Real People
            </h2>
          </div>

          <div className="products-preview__grid">
            {/* RAY */}
            <article className="products-preview__card products-preview__card--ray reveal reveal-delay-1">
              <div className="products-preview__label">Flagship Product</div>
              <h3 className="products-preview__name">RAY</h3>
              <p className="products-preview__desc">
                A mobile-first marketplace simplifying buying and selling in Rwanda —
                starting with phones and electronics. Fast, transparent, and built on trust.
              </p>
              <ul className="products-preview__features" aria-label="RAY features">
                <li>Post items quickly</li>
                <li>Connect directly with buyers</li>
                <li>Transparent price negotiation</li>
                <li>Wider, more active market</li>
              </ul>
              <Link to="/products" className="btn btn--primary products-preview__btn">
                Discover RAY
              </Link>
            </article>

            {/* Humura */}
            <article className="products-preview__card products-preview__card--humura reveal reveal-delay-2">
              <div className="products-preview__label products-preview__label--upcoming">Upcoming</div>
              <h3 className="products-preview__name">Humura</h3>
              <p className="products-preview__desc">
                A digital platform focused on mental wellness and emotional support —
                providing safe, anonymous, human-centered experiences for personal wellbeing.
              </p>
              <ul className="products-preview__features" aria-label="Humura features">
                <li>Safe &amp; anonymous access</li>
                <li>Human-centered design</li>
                <li>Trusted digital environment</li>
                <li>Meaningful impact</li>
              </ul>
              <Link to="/products" className="btn btn--outline products-preview__btn">
                Learn More
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* ===================== APPROACH ===================== */}
      <section className="approach" aria-labelledby="approach-heading">
        <div className="container">
          <div className="approach__inner">
            <div className="approach__text reveal">
              <span className="section-eyebrow">Our Approach</span>
              <h2 id="approach-heading">How We Build</h2>
              <p>
                Every product we ship follows a disciplined philosophy — designed for
                real people, built to scale, and grounded in trust.
              </p>
            </div>

            <div className="approach__cards">
              {[
                { title: 'User-Centered Design', desc: 'We build for real people with real needs — not assumptions.' },
                { title: 'Speed & Execution', desc: 'We prioritize rapid development and continuous improvement.' },
                { title: 'Scalability First', desc: 'Every system is architected to grow with demand from day one.' },
                { title: 'Trust & Safety', desc: 'Trust mechanisms are integrated into every product from the start.' },
              ].map((item, i) => (
                <div
                  className={`approach__card reveal reveal-delay-${i + 1}`}
                  key={item.title}
                >
                  <div className="approach__card-num" aria-hidden="true">0{i + 1}</div>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== CTA BANNER ===================== */}
      <section className="cta-banner" aria-label="Call to action">
        <div className="container cta-banner__inner reveal">
          <div className="cta-banner__text">
            <h2>Ready to Build the Future Together?</h2>
            <p>Partner with AYA Informatica to create the digital infrastructure Africa deserves.</p>
          </div>
          <div className="cta-banner__actions">
            <Link to="/contact" className="btn btn--primary">Get in Touch</Link>
            <Link to="/products" className="btn btn--outline-dark">See Our Products</Link>
          </div>
        </div>
      </section>
    </>
  )
}
