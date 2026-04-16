import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import './AboutPage.css'
import './ServicesPage.css'

const services = [
  {
    id: '01',
    title: 'Platform Development',
    tagline: 'End-to-end digital platforms built to scale.',
    desc: 'We design and build scalable digital platforms from the ground up. Whether you need a marketplace, a service directory, or a transactional platform, we architect it for reliability, performance, and long-term growth.',
    capabilities: [
      'Mobile-first application development',
      'API design and backend infrastructure',
      'Marketplace and commerce platforms',
      'Real-time communication systems',
      'Third-party integrations and payments',
      'Cloud infrastructure and DevOps',
    ],
  },
  {
    id: '02',
    title: 'Intelligent Systems',
    tagline: 'Data-driven systems that make smarter decisions.',
    desc: 'We design systems that leverage data and modern technologies to improve efficiency, decision-making, and user experience. From recommendation engines to analytics dashboards — we help businesses operate with intelligence.',
    capabilities: [
      'Data pipeline design and engineering',
      'Analytics dashboards and reporting',
      'Recommendation and search systems',
      'Process automation and workflow tools',
      'Performance monitoring systems',
      'User behavior and engagement analysis',
    ],
  },
  {
    id: '03',
    title: 'Digital Solutions',
    tagline: 'Tailored software for businesses ready to modernize.',
    desc: 'We provide customized software solutions for businesses that want to digitize, streamline, and scale their operations. We work closely with clients to understand their challenges and build solutions that fit — not generic tools, but purposeful software.',
    capabilities: [
      'Custom business software development',
      'Legacy system modernization',
      'Web and mobile application development',
      'CMS and content platform development',
      'ERP and operational tooling',
      'Ongoing support and maintenance',
    ],
  },
]

export default function ServicesPage() {
  useScrollReveal()

  useEffect(() => {
    document.title = 'Services – AYA Informatica'
  }, [])

  return (
    <>
      {/* ===================== HERO ===================== */}
      <section className="page-hero page-hero--navy" aria-label="Services page hero">
        <div className="page-hero__bg" aria-hidden="true">
          <div className="page-hero__accent-line page-hero__accent-line--1" />
          <div className="page-hero__accent-line page-hero__accent-line--2" />
        </div>
        <div className="container page-hero__content">
          <span className="section-eyebrow section-eyebrow--light reveal">Our Services</span>
          <h1 className="reveal reveal-delay-1" style={{ color: 'var(--white)' }}>
            We Build.<br />
            <span style={{ color: 'var(--accent)' }}>You Scale.</span>
          </h1>
          <p className="page-hero__sub reveal reveal-delay-2">
            From scalable platforms to intelligent systems and custom digital
            solutions — AYA Informatica brings the technical depth and product
            thinking your business needs to grow.
          </p>
        </div>
      </section>

      {/* ===================== SERVICES LIST ===================== */}
      {services.map((svc, i) => (
        <section
          key={svc.id}
          className={`service-section${i % 2 === 1 ? ' service-section--alt' : ''}`}
          aria-labelledby={`svc-${svc.id}`}
        >
          <div className="container service-section__inner">
            <div className="service-section__text reveal">
              <span className="service-section__num" aria-hidden="true">{svc.id}</span>
              <h2 id={`svc-${svc.id}`}>{svc.title}</h2>
              <p className="service-section__tagline">{svc.tagline}</p>
              <p className="service-section__desc">{svc.desc}</p>
              <Link to="/contact" className="btn btn--primary service-section__cta">
                Discuss Your Project
              </Link>
            </div>

            <div className="service-section__capabilities reveal reveal-delay-2">
              <h3 className="service-section__cap-title">What This Includes</h3>
              <ul className="service-section__cap-list" aria-label={`${svc.title} capabilities`}>
                {svc.capabilities.map((cap) => (
                  <li key={cap} className="service-section__cap-item">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3 8.5l3.5 3.5 6.5-7" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {cap}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ))}

      {/* ===================== APPROACH ===================== */}
      <section className="services-approach" aria-labelledby="approach-heading">
        <div className="container">
          <div className="section-header section-header--light reveal">
            <span className="section-eyebrow section-eyebrow--light">How We Work</span>
            <h2 id="approach-heading" style={{ color: 'var(--white)' }}>
              Our Process
            </h2>
          </div>
          <div className="services-approach__steps">
            {[
              { step: '01', title: 'Discover', desc: 'We start by understanding your business, your users, and the problem you\'re solving.' },
              { step: '02', title: 'Design', desc: 'We architect a solution with clear thinking — user-centered, scalable, and grounded in your context.' },
              { step: '03', title: 'Build', desc: 'We develop fast and iteratively, keeping you involved and shipping real progress continuously.' },
              { step: '04', title: 'Scale', desc: 'We deploy, monitor, and optimize — ensuring your platform grows as your business grows.' },
            ].map((item, i) => (
              <article
                className={`process-step reveal reveal-delay-${i + 1}`}
                key={item.step}
              >
                <div className="process-step__num" aria-hidden="true">{item.step}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== WHY AYA ===================== */}
      <section className="why-aya" aria-labelledby="why-heading">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-eyebrow">Why Choose AYA Informatica</span>
            <h2 id="why-heading">What Sets Us Apart</h2>
          </div>
          <div className="why-aya__grid">
            {[
              {
                title: 'Deep Local Market Knowledge',
                desc: 'We are based in Kigali and understand the realities of building for African markets — infrastructure, user behavior, and business dynamics.',
              },
              {
                title: 'Mobile-First by Default',
                desc: 'Everything we build is designed for mobile-first use, because that\'s how most of Africa accesses digital services.',
              },
              {
                title: 'Product-Driven Thinking',
                desc: 'We think like product builders, not just developers — ensuring what we build serves real user needs and business goals.',
              },
              {
                title: 'Trust-First Architecture',
                desc: 'We integrate trust, safety, and reliability mechanisms from day one — not as afterthoughts, but as core design principles.',
              },
            ].map((item, i) => (
              <article
                className={`why-card reveal reveal-delay-${(i % 2) + 1}`}
                key={item.title}
              >
                <div className="why-card__icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M4 11l5 5 9-9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="cta-banner" aria-label="Services CTA">
        <div className="container cta-banner__inner reveal">
          <div className="cta-banner__text">
            <h2>Ready to Build Something Great?</h2>
            <p>Tell us about your project. We build for the future — grounded in the needs of today.</p>
          </div>
          <div className="cta-banner__actions">
            <Link to="/contact" className="btn btn--primary">Start a Conversation</Link>
          </div>
        </div>
      </section>
    </>
  )
}
