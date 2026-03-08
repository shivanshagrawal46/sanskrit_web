import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import appIcon from '../assets/icons/app_icon.png'
import './Footer.css'

const learnLinks = [
  { label: 'Sanskrit Dictionary', to: '/dictionary' },
  { label: 'Verb Forms', to: '/verb-forms' },
  { label: 'Word Forms', to: '/word-forms' },
  { label: 'Anthology', to: '/anthology' },
  { label: 'Learn Sanskrit', to: '/learn' },
  { label: 'Suffixes', to: '/suffixes' },
]

const exploreLinks = [
  { label: 'Sacred Texts', to: '/sacred-texts' },
  { label: 'Books', to: '/books' },
  { label: 'Divine Quotes', to: '/divine-quotes' },
]

const socialLinks = [
  {
    label: 'YouTube',
    href: '#',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.8 15.5V8.5l6.3 3.5-6.3 3.5z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: '#',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.5 14.4c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.2-.7-1.7-1-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4C8 7.3 7 8.3 7 10.1c0 1.7 1.3 3.4 1.5 3.6.2.2 2.5 3.8 6 5.3 3.6 1.5 3.6 1 4.2 1 .6 0 1.9-.8 2.2-1.5.3-.7.3-1.3.2-1.5-.1-.1-.3-.2-.6-.4z" />
        <path d="M12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.6 1.4 5.1L2 22l5.1-1.3C8.5 21.5 10.2 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.7 0-3.3-.5-4.7-1.3l-.3-.2-3 .8.8-2.9-.2-.3C3.5 15.3 3 13.7 3 12 3 7 7 3 12 3s9 4 9 9-4 9-9 9z" />
      </svg>
    ),
  },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      {/* top divider wave */}
      <div className="footer-wave" aria-hidden>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,0 L0,0 Z" fill="var(--cream-dark)" />
        </svg>
      </div>

      <div className="footer-inner">
        {/* Brand column */}
        <motion.div
          className="footer-brand"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="footer-logo">
            <img src={appIcon} alt="VadatSanskritam" className="footer-logo-img" />
            <span className="footer-logo-text">
              <span className="footer-logo-v">Vadat</span>
              <span className="footer-logo-s">Sanskritam</span>
            </span>
          </div>
          <p className="footer-tagline sanskrit">वदत संस्कृतम् — बोलो संस्कृत</p>
          <p className="footer-desc">
            A digital sanctuary for Sanskrit learners — from first syllable to sacred scripture.
          </p>
          <div className="footer-socials">
            {socialLinks.map((s) => (
              <a key={s.label} href={s.href} className="footer-social-btn" aria-label={s.label} target="_blank" rel="noopener noreferrer">
                {s.icon}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Learn column */}
        <motion.div
          className="footer-col"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <h4 className="footer-col-title">Learn</h4>
          <ul className="footer-links">
            {learnLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="footer-link">{l.label}</Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Explore column */}
        <motion.div
          className="footer-col"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <h4 className="footer-col-title">Explore</h4>
          <ul className="footer-links">
            {exploreLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="footer-link">{l.label}</Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Sanskrit shloka column */}
        <motion.div
          className="footer-col footer-shloka-col"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <h4 className="footer-col-title">Daily Shloka</h4>
          <div className="footer-shloka">
            <span className="footer-shloka-icon">❝</span>
            <p className="footer-shloka-text sanskrit">
              विद्या ददाति विनयं विनयाद् याति पात्रताम्।
            </p>
            <p className="footer-shloka-meaning">
              Knowledge gives humility; from humility comes worthiness.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <p className="footer-copy">
          © {year} VadatSanskritam. Made with devotion for the love of Sanskrit.
        </p>
        <p className="footer-copy-sanskrit sanskrit">
          सर्वे भवन्तु सुखिनः
        </p>
      </div>
    </footer>
  )
}
