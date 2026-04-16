import { useState, useEffect, FormEvent } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import './AboutPage.css'
import './ContactPage.css'

type FormState = {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export default function ContactPage() {
  useScrollReveal()

  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<FormStatus>('idle')

  useEffect(() => {
    document.title = 'Contact – AYA Informatica'
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('submitting')

    /* Simulate form submission (replace with actual endpoint in production) */
    try {
      await new Promise((res) => setTimeout(res, 1500))
      setStatus('success')
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      {/* ===================== HERO ===================== */}
      <section className="page-hero page-hero--navy" aria-label="Contact page hero">
        <div className="page-hero__bg" aria-hidden="true">
          <div className="page-hero__accent-line page-hero__accent-line--1" />
          <div className="page-hero__accent-line page-hero__accent-line--2" />
        </div>
        <div className="container page-hero__content">
          <span className="section-eyebrow section-eyebrow--light reveal">Contact Us</span>
          <h1 className="reveal reveal-delay-1" style={{ color: 'var(--white)' }}>
            Let's Build<br />
            <span style={{ color: 'var(--accent)' }}>Together</span>
          </h1>
          <p className="page-hero__sub reveal reveal-delay-2">
            Whether you want to partner, collaborate, get early access to our products,
            or simply learn more — we'd love to hear from you.
          </p>
        </div>
      </section>

      {/* ===================== CONTACT MAIN ===================== */}
      <section className="contact-main" aria-labelledby="contact-form-heading">
        <div className="container contact-main__inner">

          {/* Info sidebar */}
          <aside className="contact-info reveal" aria-label="Contact information">
            <div className="contact-info__block">
              <h2 id="contact-form-heading" className="contact-info__title">
                Get in Touch
              </h2>
              <p className="contact-info__desc">
                We are based in Kigali, Rwanda — and we're building for all of Africa.
                Reach out and let's start a conversation.
              </p>
            </div>

            <div className="contact-info__items">
              <div className="contact-info__item">
                <div className="contact-info__item-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M3 8l7 5 7-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <span className="contact-info__item-label">Email</span>
                  <a
                    href="mailto:ay.company.andy@gmail.com"
                    className="contact-info__item-value"
                    aria-label="Send email to AYA Informatica"
                  >
                    ay.company.andy@gmail.com
                  </a>
                </div>
              </div>

              <div className="contact-info__item">
                <div className="contact-info__item-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M3 4a1 1 0 011-1h2.5l1 3-1.5 1.5a11 11 0 005.5 5.5L13 11.5l3 1V15a1 1 0 01-1 1C7.163 16 3 11.837 3 6.5V4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <span className="contact-info__item-label">Phone / WhatsApp</span>
                  <a
                    href="tel:+250787891746"
                    className="contact-info__item-value"
                    aria-label="Call AYA Informatica"
                  >
                    +250 787 891 746
                  </a>
                </div>
              </div>

              <div className="contact-info__item">
                <div className="contact-info__item-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 11a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M10 2C6.686 2 4 4.686 4 8c0 5.25 6 10 6 10s6-4.75 6-10c0-3.314-2.686-6-6-6z" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                </div>
                <div>
                  <span className="contact-info__item-label">Location</span>
                  <span className="contact-info__item-value">Kigali, Rwanda</span>
                </div>
              </div>
            </div>

            <div className="contact-info__topics">
              <h3 className="contact-info__topics-title">What can we help with?</h3>
              <div className="contact-info__topic-tags">
                {[
                  'Partnership',
                  'RAY Early Access',
                  'Humura Updates',
                  'Service Inquiry',
                  'Investment',
                  'General Questions',
                ].map((tag) => (
                  <span key={tag} className="contact-tag">{tag}</span>
                ))}
              </div>
            </div>
          </aside>

          {/* Contact Form */}
          <div className="contact-form-wrapper reveal reveal-delay-2">
            {status === 'success' ? (
              <div className="contact-success" role="alert">
                <div className="contact-success__icon" aria-hidden="true">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="20" r="19" stroke="var(--accent)" strokeWidth="2"/>
                    <path d="M12 20l6 6 10-12" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Message Sent!</h3>
                <p>
                  Thank you for reaching out. We'll get back to you as soon as possible.
                  <br />
                  <br />
                  Let's build the future together.
                </p>
                <button
                  className="btn btn--outline-dark"
                  onClick={() => setStatus('idle')}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form
                className="contact-form"
                onSubmit={handleSubmit}
                noValidate
                aria-label="Contact form"
              >
                <h3 className="contact-form__title">Send Us a Message</h3>

                <div className="contact-form__row">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      Full Name <span aria-label="required">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className="form-input"
                      placeholder="Your full name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                      aria-required="true"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Email Address <span aria-label="required">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="form-input"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                      aria-required="true"
                    />
                  </div>
                </div>

                <div className="contact-form__row">
                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">Phone (Optional)</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      className="form-input"
                      placeholder="+250 ..."
                      value={form.phone}
                      onChange={handleChange}
                      autoComplete="tel"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject" className="form-label">
                      Subject <span aria-label="required">*</span>
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      className="form-input form-select"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      aria-required="true"
                    >
                      <option value="" disabled>Select a topic</option>
                      <option value="partnership">Partnership</option>
                      <option value="ray-access">RAY Early Access</option>
                      <option value="humura">Humura Platform</option>
                      <option value="services">Service Inquiry</option>
                      <option value="investment">Investment</option>
                      <option value="other">General / Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">
                    Message <span aria-label="required">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    className="form-input form-textarea"
                    placeholder="Tell us about yourself and how we can help..."
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    aria-required="true"
                  />
                </div>

                {status === 'error' && (
                  <p className="contact-form__error" role="alert">
                    Something went wrong. Please try emailing us directly at ay.company.andy@gmail.com
                  </p>
                )}

                <button
                  type="submit"
                  className="btn btn--primary contact-form__submit"
                  disabled={status === 'submitting'}
                  aria-busy={status === 'submitting'}
                >
                  {status === 'submitting' ? (
                    <>
                      <span className="contact-form__spinner" aria-hidden="true" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M2 8h12M10 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ===================== CLOSING ===================== */}
      <section className="contact-closing" aria-label="Closing statement">
        <div className="container contact-closing__inner reveal">
          <div className="contact-closing__quote">
            <blockquote>
              "Partner with us to build the future."
            </blockquote>
            <cite>— AYA Informatica</cite>
          </div>
          <div className="contact-closing__pillars">
            {[
              { label: 'Builders', icon: '🔨' },
              { label: 'Engineers', icon: '⚙️' },
              { label: 'Thinkers', icon: '💡' },
            ].map((item) => (
              <div className="contact-closing__pillar" key={item.label}>
                <span aria-hidden="true">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
