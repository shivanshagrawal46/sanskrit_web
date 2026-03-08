import { Link } from 'react-router-dom'
import { Row, Col, Card } from 'antd'
import { motion } from 'framer-motion'
import littleGuru from '../assets/icons/little-guru.png'
import sacredTextsImg from '../assets/icons/krishna_geeta_sacred_moment.png'
import dictionaryImg from '../assets/icons/sacred_tree_with_glowing_roots.png'
import verbFormsImg from '../assets/icons/upanishadic_mystical_wisdom.png'
import anthologyImg from '../assets/icons/anthology.png'
import learnImg from '../assets/icons/learn.png'
import wordformImg from '../assets/icons/wordform.png'
import suffixesImg from '../assets/icons/suffixes.png'
import granthImg from '../assets/icons/granth.jpeg'
import './LearningTreasury.css'

const cards = [
  {
    key: 'sacred',
    sanskrit: 'पवित्र ग्रन्थाः',
    title: 'SACRED TEXTS',
    description: 'Explore Bhagavad Gita, Upanishads, Vedas, and more with translations and commentaries.',
    image: sacredTextsImg,
    accent: 'teal',
    href: '/sacred-texts',
  },
  {
    key: 'dictionary',
    sanskrit: 'शब्दकोशः',
    title: 'SANSKRIT DICTIONARY',
    description: 'Comprehensive Sanskrit-English dictionary with 10,000+ words, meanings, and usage examples.',
    image: dictionaryImg,
    accent: 'gold',
    href: '/dictionary',
  },
  {
    key: 'verbs',
    sanskrit: 'धातुरूपाणि',
    title: 'VERB FORMS',
    description: 'Master all verb conjugations across ten lakaaras with interactive practice tools.',
    image: verbFormsImg,
    accent: 'teal',
    href: '/verb-forms',
  },
  {
    key: 'anthology',
    sanskrit: 'सुभाषित कोश',
    title: 'ANTHOLOGY',
    description: 'Timeless Sanskrit subhashitas — wise sayings, proverbs, and poetic gems from ancient literature.',
    image: anthologyImg,
    accent: 'gold',
    href: '/anthology',
  },
  {
    key: 'word-forms',
    sanskrit: 'शब्दरूप',
    title: 'WORD FORMS',
    description: 'Learn declension tables for nouns and pronouns across all eight cases in Sanskrit grammar.',
    image: wordformImg,
    accent: 'teal',
    href: '/word-forms',
  },
  {
    key: 'learn',
    sanskrit: 'पठत संस्कृतम्',
    title: 'LEARN',
    description: 'Step-by-step Sanskrit lessons from script to sentence — structured for beginners and beyond.',
    image: learnImg,
    accent: 'gold',
    href: '/learn',
  },
  {
    key: 'suffixes',
    sanskrit: 'प्रत्यय',
    title: 'SUFFIXES',
    description: 'Master Sanskrit suffixes — krit, taddhita, and strī pratyayas — the backbone of word derivation.',
    image: suffixesImg,
    accent: 'teal',
    href: '/suffixes',
  },
  {
    key: 'books',
    sanskrit: 'पुस्तकानि',
    title: 'BOOKS',
    description: 'Browse the classical Sanskrit literature collection — Sahitya, Puranas, Vedas, and Smritis.',
    image: granthImg,
    accent: 'gold',
    href: '/books',
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 60, rotateY: 8, scale: 0.92 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateY: 0,
    scale: 1,
    transition: {
      duration: 0.85,
      delay: 0.15 * i,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

export default function LearningTreasury() {
  return (
    <section id="treasury" className="treasury">
      <div className="treasury-inner">
        <motion.div
          className="treasury-header-with-guru"
          initial={{ opacity: 0, y: 60, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="treasury-header-content">
            <p className="treasury-sanskrit sanskrit">विद्या ददाति विनयम्</p>
            <h2 className="treasury-heading display-heading">YOUR LEARNING TREASURY</h2>
            <p className="treasury-subtitle">
              Everything you need to master the divine language, from foundational grammar to sacred
              scriptures.
            </p>
          </div>
          <div className="treasury-little-guru">
            <img
              src={littleGuru}
              alt="Little guru – your guide to Sanskrit learning"
              className="little-guru-img"
            />
          </div>
        </motion.div>
        <Row gutter={[24, 24]} className="treasury-cards" justify="center">
          {cards.map((card, index) => (
            <Col xs={24} sm={12} md={8} key={card.key}>
              <motion.div
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                className="treasury-card-3d-wrapper"
              >
                {card.href ? (
                  <Link to={card.href} className="treasury-card-link">
                    <Card
                      className={`treasury-card treasury-card-${card.accent}`}
                      variant="borderless"
                    >
                      <div className="treasury-card-image">
                        <img src={card.image} alt={card.title} />
                      </div>
                      <p className="treasury-card-sanskrit sanskrit">{card.sanskrit}</p>
                      <h3 className="treasury-card-title">{card.title}</h3>
                      <p className="treasury-card-desc">{card.description}</p>
                    </Card>
                  </Link>
                ) : (
                  <Card
                    className={`treasury-card treasury-card-${card.accent}`}
                    variant="borderless"
                  >
                    <div className="treasury-card-image">
                      <img src={card.image} alt={card.title} />
                    </div>
                    <p className="treasury-card-sanskrit sanskrit">{card.sanskrit}</p>
                    <h3 className="treasury-card-title">{card.title}</h3>
                    <p className="treasury-card-desc">{card.description}</p>
                  </Card>
                )}
              </motion.div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  )
}
