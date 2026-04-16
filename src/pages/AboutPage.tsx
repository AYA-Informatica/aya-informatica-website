import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import './AboutPage.css'

export default function AboutPage() {
  useScrollReveal()

  useEffect(() => {
    document.title = 'About – AYA Informatica'
  }, [])

  return (
    <>
      {/* ===================== PAGE HERO ===================== */}
      <section className="page-hero page-hero--navy" aria-label="About page hero">
        <div className="page-hero__bg" aria-hidden="true">
          <div className="page-hero__bg-grid" />
          <div className="page-hero__bg-circle page-hero__bg-circle--1" />
          <div className="page-hero__bg-circle page-hero__bg-circle--2" />
          <div className="page-hero__accent-line page-hero__accent-line--1" />
          <div className="page-hero__accent-line page-hero__accent-line--2" />
        </div>
        <div className="container page-hero__content">
          <div className="page-hero__badge reveal">
            <span className="page-hero__badge-dot" aria-hidden="true" />
            Our Story
          </div>
          <h1 className="reveal reveal-delay-1" style={{ color: 'var(--white)' }}>
            Built From Rwanda.<br />
            <span style={{ color: 'var(--accent)' }}>For Africa.</span>
          </h1>
          <p className="page-hero__sub reveal reveal-delay-2">
            We are a focused team of builders, engineers, and thinkers committed
            to creating impactful digital products that change how Africa lives, trades,
            and connects.
          </p>
        </div>
        <div className="page-hero__scroll-hint" aria-hidden="true">
          <div className="page-hero__scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* ===================== OVERVIEW ===================== */}
      <section className="about-overview" aria-labelledby="overview-heading">
        <div className="container about-overview__inner">
          <div className="about-overview__text reveal">
            <span className="section-eyebrow">Company Overview</span>
            <h2 id="overview-heading">
              More Than Apps.<br />Digital Infrastructure.
            </h2>
            <p>
              AYA Informatica is a Rwanda-based technology company focused on
              building scalable digital platforms that connect people, businesses,
              and opportunities across Africa.
            </p>
            <p>
              We take a product-first approach to solving real-world challenges,
              designing systems that are simple, reliable, and built for everyday use.
              Our work sits at the intersection of commerce, technology, and human
              experience.
            </p>
            <p>
              At AYA Informatica, we are not just building applications — we are
              building the digital infrastructure for how people live, trade, and
              interact in the modern African economy.
            </p>
          </div>
          <div className="about-overview__visual reveal reveal-delay-2" aria-hidden="true">
            <div className="about-visual-card">
              <div className="about-visual-card__top">
                <div className="about-visual-stat">
                  <span className="about-visual-stat__num">2026</span>
                  <span className="about-visual-stat__label">Founded in Kigali</span>
                </div>
                <div className="about-visual-stat">
                  <span className="about-visual-stat__num">1B+</span>
                  <span className="about-visual-stat__label">Potential users across Africa</span>
                </div>
              </div>
              <div className="about-visual-card__bottom">
                <blockquote className="about-visual-quote">
                  "We are building for the future — but grounded in the needs of today."
                </blockquote>
                <cite>— AYA Informatica</cite>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== VISION & MISSION ===================== */}
      <section className="vm-section" aria-labelledby="vm-heading">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-eyebrow">Vision &amp; Mission</span>
            <h2 id="vm-heading">Why We Exist</h2>
          </div>
          <div className="vm-section__grid">
            <article className="vm-card vm-card--vision reveal reveal-delay-1">
              <div className="vm-card__icon" aria-hidden="true">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="6" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 2v4M16 26v4M2 16h4M26 16h4M6.34 6.34l2.83 2.83M22.83 22.83l2.83 2.83M6.34 25.66l2.83-2.83M22.83 9.17l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="vm-card__type">Vision</span>
              <h3>Africa's Leading Builder of Digital Ecosystems</h3>
              <p>
                To become Africa's leading builder of digital ecosystems that
                power everyday life — from commerce to connection, from commerce
                to wellness.
              </p>
            </article>

            <article className="vm-card vm-card--mission reveal reveal-delay-2">
              <div className="vm-card__icon" aria-hidden="true">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M16 4L4 10v12l12 6 12-6V10L16 4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                  <path d="M16 4v18M4 10l12 6 12-6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="vm-card__type">Mission</span>
              <h3>Design Platforms. Simplify Commerce. Connect Africa.</h3>
              <p>
                To design and deploy innovative platforms that simplify commerce,
                enhance human connection, and unlock economic opportunities
                across the continent.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ===================== TEAM ===================== */}
      <section className="team-section" aria-labelledby="team-heading">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-eyebrow">Our Team</span>
            <h2 id="team-heading">Builders. Engineers. Thinkers.</h2>
            <p className="section-sub">
              AYA Informatica is led by a focused team committed to creating impactful
              digital products. We operate lean, fast, and with clarity.
            </p>
          </div>

          <div className="team-section__grid">
            {[
              {
                role: 'Founder & CEO',
                desc: 'Vision, product strategy, and growth. The driving force behind AYA Informatica\'s mission to build Africa\'s digital infrastructure.',
                icon: (
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
                    <circle cx="18" cy="12" r="7" stroke="currentColor" strokeWidth="2"/>
                    <path d="M4 32c0-7.732 6.268-14 14-14s14 6.268 14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ),
              },
              {
                role: 'Development Team',
                desc: 'Responsible for building scalable, efficient systems. The engineers who turn vision into working digital reality.',
                icon: (
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
                    <rect x="4" y="6" width="28" height="22" rx="3" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 16l-4 4 4 4M24 16l4 4-4 4M17 14l2 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
              },
            ].map((member, i) => (
              <article
                className={`team-card reveal reveal-delay-${i + 1}`}
                key={member.role}
              >
                <div className="team-card__icon">{member.icon}</div>
                <h3>{member.role}</h3>
                <p>{member.desc}</p>
              </article>
            ))}
          </div>

          <div className="team-section__ethos reveal">
            <p>
              <strong>We operate lean, fast, and with clarity.</strong> Small team,
              big ambitions, disciplined execution.
            </p>
          </div>
        </div>
      </section>

      {/* ===================== ROADMAP ===================== */}
      <section className="roadmap" aria-labelledby="roadmap-heading">
        <div className="container">
          <div className="section-header section-header--light reveal">
            <span className="section-eyebrow section-eyebrow--light">Our Roadmap</span>
            <h2 id="roadmap-heading" style={{ color: 'var(--white)' }}>
              The Path Ahead
            </h2>
          </div>

          <div className="roadmap__steps">
            {[
              { step: '01', title: 'Launch & Scale RAY in Kigali', desc: 'Establish Rwanda\'s go-to mobile marketplace for phones and electronics.' },
              { step: '02', title: 'Expand Categories & User Base', desc: 'Broaden the marketplace to new product categories and grow the active community.' },
              { step: '03', title: 'Introduce Humura Platform', desc: 'Launch our mental wellness and emotional support platform for Africa.' },
              { step: '04', title: 'Build an Integrated Ecosystem', desc: 'Connect our platforms into a unified digital ecosystem powering everyday African life.' },
            ].map((item, i) => (
              <div
                className={`roadmap__step reveal reveal-delay-${i % 3 + 1}`}
                key={item.step}
              >
                <div className="roadmap__step-num" aria-hidden="true">{item.step}</div>
                <div className="roadmap__step-content">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
                {i < 3 && <div className="roadmap__connector" aria-hidden="true" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="about-cta" aria-label="About page CTA">
        <div className="container about-cta__inner reveal">
          <h2>Join Us in Building Africa's Digital Future</h2>
          <p>Whether you want to partner, invest, or collaborate — we want to hear from you.</p>
          <Link to="/contact" className="btn btn--primary">Get in Touch</Link>
        </div>
      </section>
    </>
  )
}
