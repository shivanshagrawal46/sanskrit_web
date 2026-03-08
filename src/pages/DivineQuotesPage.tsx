import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import { fetchDivineQuotes, type DivineQuote } from '../services/divineQuotesApi'
import './DivineQuotesPage.css'

export default function DivineQuotesPage() {
  const [quotes, setQuotes] = useState<DivineQuote[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetchDivineQuotes(page)
      .then((r) => { setQuotes(r.quotes); setTotalPages(r.pagination.totalPages) })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load divine quotes'))
      .finally(() => setLoading(false))
  }, [page])

  return (
    <div className="dqp-wrap">
      <Header />
      <main className="dqp-main">
        <div className="dqp-back">
          <Link to="/" className="dqp-back-link">
            <ArrowLeftOutlined /> Back to Home
          </Link>
        </div>

        <motion.div
          className="dqp-hero"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="dqp-eyebrow sanskrit">प्रेरणा</span>
          <h1 className="dqp-title display-heading">Divine Quotes</h1>
          <p className="dqp-subtitle">
            A curated stream of Sanskrit wisdom with simple meanings for daily inspiration.
          </p>
        </motion.div>

        <section className="dqp-list">
          {loading && (
            <div className="dqp-state">
              <div className="dqp-spinner" />
              <span>Loading wisdom…</span>
            </div>
          )}
          {error && !loading && <div className="dqp-state dqp-error">{error}</div>}

          {!loading && !error && quotes.map((quote, i) => (
            <motion.article
              key={quote.id}
              className="dqp-card"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="dqp-card-accent" aria-hidden />
              <div className="dqp-quote-icon" aria-hidden>❝</div>
              <div className="dqp-card-body">
                <h2 className="dqp-quote-text sanskrit">{quote.quote}</h2>
                <p className="dqp-quote-meaning">"{quote.meaning}"</p>
              </div>
            </motion.article>
          ))}
        </section>

        {totalPages > 1 && (
          <div className="dqp-pagination">
            <button type="button" onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
              ← Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button type="button" onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
              Next →
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
