import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import appIcon from '../assets/icons/app_icon.png'
import './SplashScreen.css'

const NAME = 'वदत संस्कृतम्'

function splitGraphemes(text: string): string[] {
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const seg = new Intl.Segmenter('hi', { granularity: 'grapheme' })
    return [...seg.segment(text)].map((s) => s.segment)
  }
  return ['वदत', ' ', 'संस्कृतम्']
}

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [exit, setExit] = useState(false)
  const clusters = useMemo(() => splitGraphemes(NAME), [])

  useEffect(() => {
    const t1 = setTimeout(() => setExit(true), 2800)
    const t2 = setTimeout(() => onDone(), 3500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onDone])

  return (
    <AnimatePresence>
      {!exit && (
        <motion.div
          className="sp"
          key="splash"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: 'easeInOut' }}
        >
          {/* background decorative circle */}
          <motion.div
            className="sp-ring"
            aria-hidden
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* logo */}
          <motion.img
            src={appIcon}
            alt=""
            className="sp-logo"
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              filter: [
                'drop-shadow(0 0 0px rgba(201,162,39,0))',
                'drop-shadow(0 0 30px rgba(201,162,39,0.6))',
                'drop-shadow(0 0 10px rgba(201,162,39,0.2))',
              ],
            }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          />

          {/* Hindi title — grapheme-by-grapheme reveal */}
          <div className="sp-title">
            {clusters.map((ch, i) =>
              ch === ' ' ? (
                <span key={i} className="sp-gap" />
              ) : (
                <div key={i} className="sp-mask">
                  <motion.span
                    className="sp-g"
                    initial={{ y: '120%', opacity: 0 }}
                    animate={{ y: '0%', opacity: 1 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.65 + i * 0.085,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {ch}
                  </motion.span>
                </div>
              )
            )}
          </div>

          {/* gold accent */}
          <motion.div
            className="sp-accent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 1.65, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* English subtitle */}
          <motion.p
            className="sp-sub"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 2.0 }}
          >
            Vadat Sanskritam
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
