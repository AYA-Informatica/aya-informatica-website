import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer__grid">

          {/* Brand column */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo" aria-label="AYA Informatica home">
              <img 
                src="/AYA Informatica Company logo.png" 
                alt="AYA Informatica" 
                className="footer__logo-img"
              />
            </Link>
            <p className="footer__tagline">
              Building Africa's<br />Digital Future
            </p>
            <p className="footer__location">
              <span aria-hidden="true">📍</span> Kigali, Rwanda
            </p>
          </div>

          {/* Navigation */}
          <div className="footer__col">
            <h3 className="footer__heading">Navigate</h3>
            <nav aria-label="Footer navigation">
              <ul className="footer__list">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/products">Products</Link></li>
                <li><Link to="/services">Services</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </nav>
          </div>

          {/* Products */}
          <div className="footer__col">
            <h3 className="footer__heading">Products</h3>
            <ul className="footer__list">
              <li><Link to="/products">RAY – Marketplace</Link></li>
              <li><Link to="/products">Humura – Wellness</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer__col">
            <h3 className="footer__heading">Get in Touch</h3>
            <ul className="footer__list footer__list--contact">
              <li>
                <a href="mailto:ay.company.andy@gmail.com" aria-label="Email AYA Informatica">
                  ay.company.andy@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+250787891746" aria-label="Call AYA Informatica">
                  +250 787 891 746
                </a>
              </li>
            </ul>
            <Link to="/contact" className="btn btn--outline footer__cta">
              Partner With Us
            </Link>
          </div>
        </div>

        <div className="footer__bottom">
          <p>&copy; {year} AYA Informatica. All rights reserved.</p>
          <p className="footer__mission">Connecting people, businesses &amp; opportunities across Africa.</p>
        </div>
      </div>
    </footer>
  )
}
