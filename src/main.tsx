import { StrictMode, useState, useCallback } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import App from './App'
import SplashScreen from './components/SplashScreen'
import './index.css'

const theme = {
  token: {
    colorPrimary: '#0d7377',
    colorSuccess: '#c9a227',
    borderRadius: 12,
    fontFamily: '"Outfit", system-ui, sans-serif',
  },
  components: {
    Button: {
      primaryShadow: '0 2px 8px rgba(13, 115, 119, 0.35)',
      fontWeight: 600,
    },
  },
}

function Root() {
  const [splashDone, setSplashDone] = useState(false)
  const handleDone = useCallback(() => setSplashDone(true), [])

  return (
    <>
      {!splashDone && <SplashScreen onDone={handleDone} />}
      <div style={{ opacity: splashDone ? 1 : 0, transition: 'opacity 0.4s ease' }}>
        <App />
      </div>
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider theme={theme}>
      <BrowserRouter>
        <Root />
      </BrowserRouter>
    </ConfigProvider>
  </StrictMode>,
)
