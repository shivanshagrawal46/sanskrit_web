import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import './InspirationSection.css'

const API_BASE = '/api'

interface Inspiration {
  _id: string
  name: string
  designation: string
  details: string
  image: string
  team_name: string
  isActive: boolean
}

export default function InspirationSection() {
  const [people, setPeople] = useState<Inspiration[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_BASE}/inspiration`, { headers: { Accept: 'application/json' }, mode: 'cors' })
      .then((r) => r.json())
      .then((json) => setPeople(json.success ? json.data : []))
      .catch(() => setPeople([]))
      .finally(() => setLoading(false))
  }, [])

  const getImageUrl = (img: string) => {
    if (!img) return ''
    if (img.startsWith('http')) return img
    return `https://samtacore.com${img}`
  }

  return (
    <section className="insp" id="inspiration-people">
      {/* ambient orbs */}
      <div className="insp-orb insp-orb-1" aria-hidden />
      <div className="insp-orb insp-orb-2" aria-hidden />

      <div className="insp-inner">
        {/* Header */}
        <motion.div
          className="insp-header"
          initial={{ opacity: 0, y: 48, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="insp-eyebrow sanskrit">प्रेरणास्रोतः</span>
          <h2 className="insp-title display-heading">Voices of Inspiration</h2>
          <p className="insp-subtitle">
            Meet the scholars and visionaries who light the path of Sanskrit wisdom.
          </p>
        </motion.div>

        {/* Cards */}
        {loading ? (
          <div className="insp-loading">
            <div className="insp-spinner" />
          </div>
        ) : (
          <div className="insp-grid">
            {people.map((person, i) => (
              <motion.div
                key={person._id}
                className="insp-card"
                initial={{ opacity: 0, y: 50, scale: 0.94 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.75, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
              >
                {/* top accent bar */}
                <div className="insp-card-bar" aria-hidden />

                {/* avatar */}
                <div className="insp-avatar-wrap">
                  {person.image ? (
                    <img
                      src={getImageUrl(person.image)}
                      alt={person.name}
                      className="insp-avatar"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.nextElementSibling?.classList.remove('insp-avatar-fallback--hidden')
                      }}
                    />
                  ) : null}
                  <div className={`insp-avatar-fallback${person.image ? ' insp-avatar-fallback--hidden' : ''}`}>
                    {person.name.charAt(0)}
                  </div>
                  <div className="insp-avatar-ring" aria-hidden />
                </div>

                {/* badge */}
                <span className="insp-badge">{person.team_name}</span>

                {/* info */}
                <h3 className="insp-name">{person.name}</h3>
                <p className="insp-designation">{person.designation}</p>

                {/* details */}
                {person.details && (
                  <p className="insp-details">{person.details}</p>
                )}

                {/* decorative quote icon */}
                <div className="insp-quote-icon" aria-hidden>❝</div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
