import { motion } from 'framer-motion'
import app1 from '../assets/icons/app1.jpg'
import app2 from '../assets/icons/app2.jpg'
import './AppDownloadSection.css'

const apps = [
  {
    id: 'vadat',
    name: 'Vadat Sanskritam',
    sanskrit: 'वदत संस्कृतम्',
    desc: 'Learn, explore & speak Sanskrit — your all-in-one companion.',
    image: app1,
    accent: 'teal' as const,
    playStore: '#',
    appStore: '#',
  },
  {
    id: 'jyotish',
    name: 'Jyotish Vishwakosh',
    sanskrit: 'ज्योतिष विश्वकोश',
    desc: 'The encyclopedia of Vedic astrology — charts, texts & cosmic wisdom.',
    image: app2,
    accent: 'gold' as const,
    playStore: '#',
    appStore: '#',
  },
]

export default function AppDownloadSection() {
  return (
    <section className="ads" id="apps">
      <div className="ads-inner">
        <motion.div
          className="ads-header"
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="ads-eyebrow sanskrit">अनुप्रयोगः</span>
          <h2 className="ads-title display-heading">Download Our Apps</h2>
          <div className="ads-line" />
        </motion.div>

        <div className="ads-row">
          {apps.map((app, i) => (
            <motion.div
              key={app.id}
              className={`ads-card ads-card--${app.accent}`}
              initial={{ opacity: 0, y: 44 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.75, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Phone */}
              <motion.div
                className="ads-phone"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: i * 1.5 }}
              >
                <img src={app.image} alt={app.name} className="ads-screen" />
              </motion.div>

              {/* Info */}
              <div className="ads-info">
                <h3 className="ads-name">{app.name}</h3>
                <p className="ads-sanskrit sanskrit">{app.sanskrit}</p>
                <p className="ads-desc">{app.desc}</p>

                <div className="ads-btns">
                  <a href={app.playStore} className={`ads-btn ads-btn--${app.accent}`} target="_blank" rel="noopener noreferrer">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3.18 23.76a2 2 0 0 0 2.1-.22l11.5-6.64-2.88-2.88L3.18 23.76zM1 1.27C.69 1.6.5 2.07.5 2.67v18.66c0 .6.19 1.07.5 1.4l.07.07 10.46-10.46v-.25L1.07 1.2 1 1.27zm18.5 9.38-3.03-1.75-3.2 3.2 3.2 3.2 3.04-1.76c.87-.5.87-1.39-.01-1.89zM5.28.46 3.18.24.07 10.46l.07.07 10.47-6.05L5.28.46z" /></svg>
                    <span>Google Play</span>
                  </a>
                  <a href={app.appStore} className="ads-btn ads-btn--ghost" target="_blank" rel="noopener noreferrer">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.37 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>
                    <span>App Store</span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
