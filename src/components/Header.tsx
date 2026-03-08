import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Layout, Button } from 'antd'
import { MenuOutlined } from '@ant-design/icons'
import appIcon from '../assets/icons/app_icon.png'
import './Header.css'

const navItems = [
  { label: 'Home',        sectionId: null },
  { label: 'Learn',       sectionId: 'treasury' },
  { label: 'Inspiration', sectionId: 'inspiration-people' },
  { label: 'Community',   sectionId: 'community' },
  { label: 'App',         sectionId: 'apps' },
]

function scrollTo(sectionId: string | null) {
  if (!sectionId) {
    // scroll home page container back to top
    const content = document.querySelector('.app-content') as HTMLElement | null
    content?.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  const el = document.getElementById(sectionId)
  if (el) {
    // scrollIntoView respects the nearest scrollable ancestor (.app-content)
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

  const handleClick = (e: React.MouseEvent, sectionId: string | null) => {
    e.preventDefault()
    setMobileMenuOpen(false)

    if (isHome) {
      scrollTo(sectionId)
    } else {
      // Navigate home first, then scroll after the page renders
      navigate('/')
      setTimeout(() => scrollTo(sectionId), 350)
    }
  }

  return (
    <Layout.Header className="sanskrit-header">
      <div className="header-inner">
        <a href="/" className="logo" onClick={(e) => handleClick(e, null)}>
          <img src={appIcon} alt="VadatSanskritam" className="logo-icon-img" />
          <span className="logo-text">
            <span className="logo-sanskrit">Vadat</span>
            <span className="logo-vidya">Sanskritam</span>
          </span>
        </a>

        <nav className="nav-desktop">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.sectionId ? `#${item.sectionId}` : '/'}
              className="nav-link"
              onClick={(e) => handleClick(e, item.sectionId)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <Button
          type="text"
          className="nav-mobile-trigger"
          icon={<MenuOutlined />}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        />

        {mobileMenuOpen && (
          <nav className="nav-mobile">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.sectionId ? `#${item.sectionId}` : '/'}
                className="nav-link"
                onClick={(e) => handleClick(e, item.sectionId)}
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </Layout.Header>
  )
}
