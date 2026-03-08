import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import wisdomImg from '../assets/icons/wisdom.png'
import { fetchDivineQuotes, type DivineQuote } from '../services/divineQuotesApi'
import './DivineQuotesSection.css'

export default function DivineQuotesSection() {
  const [quotes, setQuotes] = useState<DivineQuote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDivineQuotes(1)
      .then((r) => setQuotes(r.quotes.slice(0, 4)))
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="inspiration" className="dqs">
      {/* ambient orb background */}
      <div className="dqs-orb dqs-orb-1" aria-hidden />
      <div className="dqs-orb dqs-orb-2" aria-hidden />

      <div className="dqs-inner">
        {/* ── Header ── */}
        <motion.div
          className="dqs-header"
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="dqs-eyebrow sanskrit">ज्ञानपत्र</span>
          <h2 className="dqs-title display-heading">Scroll of Wisdom</h2>
          <p className="dqs-subtitle">
            Timeless verses that illuminate the path of knowledge and inner peace.
          </p>
        </motion.div>

        {/* ── Panel ── */}
        <div className="dqs-panel">
          {/* Image side */}
          <motion.div
            className="dqs-art"
            initial={{ opacity: 0, x: -60, rotateY: 12 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="dqs-img-frame">
              <motion.img
                src={wisdomImg}
                alt="Sage in cosmic meditation"
                className="dqs-img"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="dqs-img-glow" aria-hidden />
            </div>

              <Link to="/divine-quotes" className="dqs-cta-btn">
              Explore All Quotes
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>

          {/* Quotes side */}
          <div className="dqs-list">
            {loading && (
              <div className="dqs-loading">
                <div className="dqs-spinner" />
                <span>Loading wisdom…</span>
              </div>
            )}
            {error && !loading && <div className="dqs-error">{error}</div>}
            {!loading && !error && quotes.map((quote, i) => (
              <motion.article
                key={quote.id ?? i}
                className="dqs-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ x: 6, transition: { duration: 0.25 } }}
              >
                <div className="dqs-card-accent" aria-hidden />
                <div className="dqs-quote-icon" aria-hidden>❝</div>
                <div className="dqs-card-body">
                  <p className="dqs-quote-text sanskrit">{quote.quote}</p>
                  <p className="dqs-quote-meaning">"{quote.meaning}"</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
