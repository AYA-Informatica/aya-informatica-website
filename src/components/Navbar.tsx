import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/products', label: 'Products' },
  { path: '/services', label: 'Services' },
  { path: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  /* Detect scroll to add background blur */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /* Close mobile menu on route change */
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  /* Prevent body scroll when menu is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}${menuOpen ? ' navbar--menu-open' : ''}`} role="banner">
      <div className="container navbar__inner">
        {/* Logo */}
        <Link 
          to="/" 
          className="navbar__logo" 
          aria-label="AYA Informatica – Home"
          onClick={() => menuOpen && setMenuOpen(false)}
        >
          <img 
            src="/AYA Informatica Company logo.png" 
            alt="AYA Informatica" 
            className="navbar__logo-img"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="navbar__links" aria-label="Main navigation">
          {navLinks.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`navbar__link${pathname === path ? ' navbar__link--active' : ''}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA button */}
        <Link to="/contact" className="navbar__cta btn btn--primary" aria-label="Partner with AYA Informatica">
          Partner With Us
        </Link>

        {/* Mobile hamburger */}
        <button
          className={`navbar__hamburger${menuOpen ? ' navbar__hamburger--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`navbar__mobile${menuOpen ? ' navbar__mobile--open' : ''}`}
      >
        <nav aria-label="Mobile navigation">
          {navLinks.map(({ path, label }, i) => (
            <Link
              key={path}
              to={path}
              className={`navbar__mobile-link${pathname === path ? ' navbar__mobile-link--active' : ''}`}
              style={{ animationDelay: `${i * 0.06}s` }}
              tabIndex={menuOpen ? 0 : -1}
            >
              {label}
            </Link>
          ))}
          <Link 
            to="/contact" 
            className="btn btn--primary navbar__mobile-cta"
            tabIndex={menuOpen ? 0 : -1}
          >
            Partner With Us
          </Link>
        </nav>
      </div>
    </header>
  )
}
