import { motion } from 'framer-motion'
import './Hero.css'

function scrollToTreasury(e: React.MouseEvent) {
  e.preventDefault()
  document.getElementById('treasury')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const stats = [
  { value: '50+', label: 'Sacred Texts' },
  { value: '10K+', label: 'Words' },
  { value: '150+', label: 'Countries' },
]

const EASE = [0.22, 1, 0.36, 1] as const

const fadeSlideUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 40, filter: 'blur(6px)' },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.75, delay, ease: EASE },
  },
})

const imageReveal = {
  hidden: { opacity: 0, scale: 0.75, rotateY: -15 },
  visible: {
    opacity: 1, scale: 1, rotateY: 0,
    transition: { duration: 1.1, ease: EASE, delay: 0.3 },
  },
}

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg-pattern" aria-hidden />
      <div className="hero-inner">
        <div className="hero-layout">

          {/* ── A: Tagline + Sanskrit — above image on mobile ── */}
          <motion.div
            className="hero-intro"
            variants={fadeSlideUp(0.1)}
            initial="hidden"
            animate="visible"
          >
            <div className="tagline-pill">
              <span className="tagline-sparkle">✦</span>
              <span>The Language of the Gods</span>
            </div>
            <p className="hero-sanskrit sanskrit">वसुधैव कुटुम्बकम्</p>
          </motion.div>

          {/* ── B: Krishna image ── */}
          <motion.div
            className="hero-visual"
            variants={imageReveal}
            initial="hidden"
            animate="visible"
          >
            <motion.img
              src="/assets/krishna.png"
              alt="Bal Gopal – divine guide for your Sanskrit journey"
              className="hero-krishna-img"
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="hero-dots hero-dots-teal" aria-hidden="true"
              animate={{ y: [0, -20, 0], scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="hero-dots hero-dots-gold" aria-hidden="true"
              animate={{ y: [0, 15, 0], scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
            />
            <div className="hero-glow" aria-hidden="true" />
          </motion.div>

          {/* ── C: Heading + desc + CTAs + stats — below image on mobile ── */}
          <div className="hero-main">
            <motion.div variants={fadeSlideUp(0.25)} initial="hidden" animate="visible">
              <h1 className="hero-heading display-heading">
                <span className="heading-line heading-unlock">UNLOCK THE</span>
                <span className="heading-line heading-divine">DIVINE</span>
                <span className="heading-line heading-language">LANGUAGE</span>
              </h1>
            </motion.div>
            <motion.p
              className="hero-desc"
              variants={fadeSlideUp(0.4)} initial="hidden" animate="visible"
            >
              Discover the beauty of Sanskrit with guided lessons, sacred texts, and a supportive
              community. From foundational grammar to timeless scriptures—your journey begins here.
            </motion.p>
            <motion.div
              className="hero-ctas"
              variants={fadeSlideUp(0.5)} initial="hidden" animate="visible"
            >
              <a href="#treasury" className="btn-primary-hero" onClick={scrollToTreasury}>
                Start Your Journey
              </a>
              <a href="#treasury" className="btn-secondary-hero" onClick={scrollToTreasury}>
                Explore Resources
              </a>
            </motion.div>
            <motion.div
              className="hero-stats"
              variants={fadeSlideUp(0.6)} initial="hidden" animate="visible"
            >
              {stats.map(({ value, label }) => (
                <div className="hero-stat" key={label}>
                  <div className="stat-value">{value}</div>
                  <div className="stat-label">{label}</div>
                </div>
              ))}
            </motion.div>
          </div>

        </div>

        <motion.div
          className="hero-explore"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <motion.a
            href="#treasury"
            className="explore-link"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            EXPLORE ↓
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
