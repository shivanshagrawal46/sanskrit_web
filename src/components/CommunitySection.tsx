import { Row, Col } from 'antd'
import { motion } from 'framer-motion'
import './CommunitySection.css'

export default function CommunitySection() {
  return (
    <section className="community" id="community">
      <div className="community-inner">
        <motion.h2
          className="community-heading display-heading"
          initial={{ opacity: 0, y: 50, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          Learn in the tradition of the Guru
        </motion.h2>
        <motion.p
          className="community-subtitle"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          Join a global sangha of learners, guided by the spirit of wisdom and devotion.
        </motion.p>
        <Row gutter={[32, 32]} align="middle" className="community-row">
          <Col xs={24} md={12} className="community-visual-col">
            <motion.div
              className="community-visual guru-visual"
              initial={{ opacity: 0, x: -80, rotateY: 12 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
            >
              <img
                src="/assets/guruji-disciples.png"
                alt="Guru and disciples under the banyan tree – traditional Sanskrit learning"
                className="community-img"
              />
            </motion.div>
          </Col>
          <Col xs={24} md={12} className="community-content-col">
            <motion.div
              initial={{ opacity: 0, x: 80, rotateY: -8 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            >
              <p className="community-sanskrit sanskrit">विद्या ददाति विनयम्</p>
              <p className="community-desc">
                From sacred texts to daily practice, VadatSanskritam brings the ancient guru–shishya
                parampara to your screen. Start with the basics, explore scriptures, and grow with
                our community.
              </p>
            </motion.div>
          </Col>
        </Row>
      </div>
    </section>
  )
}
