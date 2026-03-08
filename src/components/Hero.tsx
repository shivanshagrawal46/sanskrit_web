import { Row, Col } from 'antd'
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

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const fadeSlideUp = {
  hidden: { opacity: 0, y: 50, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
}

const imageReveal = {
  hidden: { opacity: 0, scale: 0.7, rotateY: -15 },
  visible: {
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.3 },
  },
}

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg-pattern" aria-hidden />
      <div className="hero-inner">
        <Row gutter={[48, 48]} align="middle" className="hero-row">
          <Col xs={24} lg={14} className="hero-content-col">
            <motion.div variants={stagger} initial="hidden" animate="visible">
              <motion.div variants={fadeSlideUp} className="tagline-pill">
                <span className="tagline-sparkle">✦</span>
                <span>The Language of the Gods</span>
              </motion.div>
              <motion.p variants={fadeSlideUp} className="hero-sanskrit sanskrit">
                वसुधैव कुटुम्बकम्
              </motion.p>
              <motion.div variants={fadeSlideUp}>
                <h1 className="hero-heading display-heading">
                  <span className="heading-line heading-unlock">UNLOCK THE</span>
                  <span className="heading-line heading-divine">DIVINE</span>
                  <span className="heading-line heading-language">LANGUAGE</span>
                </h1>
              </motion.div>
              <motion.p variants={fadeSlideUp} className="hero-desc">
                Discover the beauty of Sanskrit with guided lessons, sacred texts, and a supportive
                community. From foundational grammar to timeless scriptures—your journey begins here.
              </motion.p>
              <motion.div variants={fadeSlideUp} className="hero-ctas">
                <a href="#treasury" className="btn-primary-hero" onClick={scrollToTreasury}>
                  Start Your Journey
                </a>
                <a href="#treasury" className="btn-secondary-hero" onClick={scrollToTreasury}>
                  Explore Resources
                </a>
              </motion.div>
              <motion.div variants={fadeSlideUp}>
                <Row gutter={[24, 16]} className="hero-stats">
                  {stats.map(({ value, label }) => (
                    <Col xs={8} key={label}>
                      <div className="stat-value">{value}</div>
                      <div className="stat-label">{label}</div>
                    </Col>
                  ))}
                </Row>
              </motion.div>
            </motion.div>
          </Col>
          <Col xs={24} lg={10} className="hero-visual-col">
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
                className="hero-dots hero-dots-teal"
                aria-hidden="true"
                animate={{ y: [0, -20, 0], scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="hero-dots hero-dots-gold"
                aria-hidden="true"
                animate={{ y: [0, 15, 0], scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
              />
              <div className="hero-glow" aria-hidden="true" />
            </motion.div>
          </Col>
        </Row>
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
