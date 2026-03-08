import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeftOutlined } from '@ant-design/icons'
import Header from '../components/Header'
import { fetchKoshCategories, fetchKoshContents } from '../services/koshApi'
import type { KoshSubcategory, KoshContent } from '../services/koshApi'
import littleGuru from '../assets/icons/little-guru.png'
import './KoshPage.css'

const KoshContentItem = ({
  content,
  index,
  getFirstChar,
  getIconColor,
  onTitleClick,
}: {
  content: KoshContent
  index: number
  getFirstChar: (word?: string) => string
  getIconColor: (i: number) => string
  onTitleClick: (c: KoshContent) => void
}) => {
  const firstChar = getFirstChar(content.hindiWord)
  const iconColor = getIconColor(index)
  return (
    <div className="kosh-content-item">
      <div className="kosh-content-icon" style={{ background: iconColor }}>
        {firstChar}
      </div>
      <div className="kosh-content-text">
        <h4
          className="kosh-content-title kosh-content-title-clickable"
          onClick={() => onTitleClick(content)}
        >
          {content.hindiWord || 'N/A'}
        </h4>
      </div>
    </div>
  )
}

const ICON_COLORS = [
  'var(--teal)',
  'var(--gold)',
  'var(--teal-light)',
  'var(--gold-light)',
  'var(--saffron)',
  '#9C27B0',
  '#2196F3',
  '#E91E63',
  '#00BCD4',
  '#8BC34A',
]

const PAGE_META: Record<string, { title: string; sanskrit: string; categoryId: number }> = {
  '/dictionary':  { title: 'Sanskrit Dictionary', sanskrit: 'शब्दकोशः',       categoryId: 7  },
  '/verb-forms':  { title: 'Verb Forms',           sanskrit: 'धातुरूपाणि',     categoryId: 1  },
  '/anthology':   { title: 'Anthology',            sanskrit: 'सुभाषित कोश',    categoryId: 15 },
  '/learn':       { title: 'Learn Sanskrit',       sanskrit: 'पठत संस्कृतम्',  categoryId: 13 },
  '/word-forms':  { title: 'Word Forms',           sanskrit: 'शब्दरूप',        categoryId: 11 },
  '/suffixes':    { title: 'Suffixes',             sanskrit: 'प्रत्यय',         categoryId: 14 },
}

export default function KoshPage() {
  const location = useLocation()
  const meta = PAGE_META[location.pathname] ?? PAGE_META['/dictionary']
  const mainCategoryId = meta.categoryId

  const [categories, setCategories] = useState<KoshSubcategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<KoshSubcategory | null>(null)
  const [allContents, setAllContents] = useState<KoshContent[]>([])
  const [visibleCount, setVisibleCount] = useState(9999)
  const [visheshSuchi, setVisheshSuchi] = useState<string[]>([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [filterTerm, setFilterTerm] = useState('')
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [selectedContent, setSelectedContent] = useState<KoshContent | null>(null)
  const [showContentModal, setShowContentModal] = useState(false)

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const loadingMoreRef = useRef(false)
  const categoryIdRef = useRef<number | string | null>(null)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setInitialLoading(true)
        setError(null)
        const data = await fetchKoshCategories(mainCategoryId)
        const list = data.subcategories || []
        setCategories(list)
        if (list.length > 0) {
          setSelectedCategory(list[0])
        } else if (mainCategoryId === 1) {
          setSelectedCategory({ id: 1, name: 'सामान्य धातुरूप' })
        } else {
          setError('No categories found.')
        }
      } catch (err) {
        setError(`Failed to load: ${err instanceof Error ? err.message : 'Unknown error'}`)
      } finally {
        setInitialLoading(false)
      }
    }
    loadCategories()
  }, [mainCategoryId])

  useEffect(() => {
    if (!selectedCategory) return
    const categoryId = Number(selectedCategory.id) || 1
    if (categoryIdRef.current === categoryId) return
    categoryIdRef.current = categoryId

    const loadContents = async () => {
      setInitialLoading(true)
      setAllContents([])
      setVisibleCount(9999)
      setError(null)

      try {
        const page1 = await fetchKoshContents(mainCategoryId, categoryId, 1)
        if (categoryIdRef.current !== categoryId) return

        const initial = page1.contents || []
        setAllContents(initial)
        setVisheshSuchi(page1.vishesh_suchi || [])
        setInitialLoading(false)

        const totalPages = page1.totalPages || 1
        if (totalPages <= 1) return

        const allFetches: Promise<Awaited<ReturnType<typeof fetchKoshContents>>>[] = []
        for (let i = 2; i <= totalPages; i++) {
          allFetches.push(fetchKoshContents(mainCategoryId, categoryId, i))
        }
        const results = await Promise.all(allFetches)
        if (categoryIdRef.current !== categoryId) return

        const moreContents = results.flatMap((p) => p.contents || [])
        setAllContents([...initial, ...moreContents])
      } catch (err) {
        if (categoryIdRef.current === categoryId) {
          setError(`Failed to load: ${err instanceof Error ? err.message : 'Unknown error'}`)
          setInitialLoading(false)
        }
      }
    }
    loadContents()
  }, [selectedCategory, mainCategoryId])

  useEffect(() => {
    setFilterTerm('')
    setSearchQuery('')
    setVisibleCount(9999)
  }, [selectedCategory])

  const filteredContents = useMemo(() => {
    let result = allContents
    if (filterTerm) {
      const term = filterTerm.toLowerCase()
      result = result.filter(
        (c) =>
          c.search?.toLowerCase().includes(term) || c.hindiWord?.toLowerCase().includes(term)
      )
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (c) =>
          c.hindiWord?.toLowerCase().includes(query) || c.meaning?.toLowerCase().includes(query)
      )
    }
    return result
  }, [allContents, filterTerm, searchQuery])

  const visibleItems = useMemo(
    () => filteredContents.slice(0, visibleCount),
    [filteredContents, visibleCount]
  )

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement
      const { scrollTop, scrollHeight, clientHeight } = target
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight
      if (scrollPercentage > 0.8 && !loadingMoreRef.current) {
        loadingMoreRef.current = true
        setVisibleCount((prev) => Math.min(prev + 100, filteredContents.length))
        setTimeout(() => {
          loadingMoreRef.current = false
        }, 50)
      }
    },
    [filteredContents.length]
  )

  const getFirstChar = useCallback((word?: string) => {
    if (!word) return '#'
    const firstChar = word.charAt(0)
    if (/[0-9०-९]/.test(firstChar)) return firstChar
    if (/[\u0900-\u097F]/.test(firstChar)) return firstChar
    if (/[a-zA-Z]/.test(firstChar)) return firstChar.toUpperCase()
    return '#'
  }, [])

  const getIconColor = useCallback((index: number) => ICON_COLORS[index % ICON_COLORS.length], [])

  const handleVisheshSuchiClick = useCallback((term: string) => {
    setFilterTerm(term)
    setShowFilterModal(false)
    setVisibleCount(9999)
    scrollContainerRef.current?.scrollTo({ top: 0 })
  }, [])

  const clearFilter = useCallback(() => {
    setFilterTerm('')
    setVisibleCount(9999)
    scrollContainerRef.current?.scrollTo({ top: 0 })
  }, [])

  const handleContentTitleClick = useCallback((content: KoshContent) => {
    setSelectedContent(content)
    setShowContentModal(true)
  }, [])

  const pageTitle = meta.title
  const pageSanskrit = meta.sanskrit

  return (
    <div className="kosh-page-wrapper">
      <Header />
      <main className="kosh-page-main">
        <div className="kosh-page-back">
          <Link to="/" className="kosh-back-link">
            <ArrowLeftOutlined /> Back to Home
          </Link>
        </div>

        <div className="kosh-page-header-with-guru">
          <div className="kosh-page-header-content">
            <h1 className="kosh-page-title display-heading">{pageTitle}</h1>
            <p className="kosh-page-sanskrit sanskrit">{pageSanskrit}</p>
          </div>
          <div className="kosh-page-little-guru">
            <img src={littleGuru} alt="Little guru – your guide" className="kosh-guru-img" />
          </div>
        </div>

        <div className="kosh-page-layout">
          {categories.length > 0 && (
            <aside className="kosh-sidebar">
              <div className="kosh-sidebar-header">
                <h3 className="sanskrit">श्रेणियाँ</h3>
              </div>
              <div className="kosh-sidebar-categories">
                {categories.map((category, index) => (
                  <motion.button
                    key={category.id}
                    className={`kosh-sidebar-category ${selectedCategory?.id === category.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    whileHover={{ x: 4 }}
                  >
                    {category.cover_image ? (
                      <div className="kosh-sidebar-category-image">
                        <img src={category.cover_image} alt={category.name} loading="lazy" />
                      </div>
                    ) : (
                      <div className="kosh-sidebar-category-image kosh-sidebar-category-placeholder">
                        <span className="sanskrit">{category.name.charAt(0)}</span>
                      </div>
                    )}
                    <span className="kosh-sidebar-category-name sanskrit">{category.name}</span>
                  </motion.button>
                ))}
              </div>
            </aside>
          )}

          <div className="kosh-main-content-wrapper">
            <div className="kosh-search-filter-bar">
              <div className="kosh-search-wrapper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="खोजें..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setVisibleCount(9999)
                  }}
                  className="kosh-search-input"
                />
              </div>
              {visheshSuchi.length > 0 && (
                <motion.button
                  className={`kosh-filter-btn ${filterTerm ? 'active' : ''}`}
                  onClick={() => setShowFilterModal(!showFilterModal)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  </svg>
                  <span>विशेष सूची</span>
                  {filterTerm && <span className="kosh-filter-badge">1</span>}
                </motion.button>
              )}
            </div>

            <div className="kosh-contents-card">
              <div className="kosh-contents-card-header">
                <h4 className="kosh-contents-card-title sanskrit">
                  {selectedCategory?.name || 'सामग्री'}
                  <span className="kosh-contents-count">({filteredContents.length} शब्द)</span>
                </h4>
                {filterTerm && (
                  <span className="kosh-active-filter">
                    {filterTerm}
                    <button type="button" onClick={clearFilter}>✕</button>
                  </span>
                )}
              </div>

              {initialLoading ? (
                <div className="kosh-loading-inline">
                  <div className="kosh-loader-small" />
                  <span>लोड हो रहा है...</span>
                </div>
              ) : error ? (
                <div className="kosh-error-inline">
                  <p>⚠️ {error}</p>
                </div>
              ) : (
                <div
                  className="kosh-contents-list-scroll"
                  ref={scrollContainerRef}
                  onScroll={handleScroll}
                >
                  {visibleItems.length > 0 ? (
                    visibleItems.map((content, index) => (
                      <KoshContentItem
                        key={content.id ?? index}
                        content={content}
                        index={index}
                        getFirstChar={getFirstChar}
                        getIconColor={getIconColor}
                        onTitleClick={handleContentTitleClick}
                      />
                    ))
                  ) : (
                    <div className="kosh-no-results-inline">
                      <p>
                        {filterTerm
                          ? `"${filterTerm}" के लिए कोई परिणाम नहीं`
                          : 'कोई सामग्री नहीं'}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {showFilterModal && (
          <>
            <motion.div
              className="kosh-filter-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilterModal(false)}
            />
            <motion.div
              className="kosh-filter-modal"
              initial={{ opacity: 0, y: '100%', x: '-50%' }}
              animate={{ opacity: 1, y: '-50%', x: '-50%' }}
              exit={{ opacity: 0, y: '100%', x: '-50%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="kosh-filter-modal-header">
                <h4 className="sanskrit">विशेष सूची</h4>
                <button type="button" onClick={() => setShowFilterModal(false)}>✕</button>
              </div>
              <div className="kosh-filter-modal-content">
                {visheshSuchi.map((term, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`kosh-filter-modal-item sanskrit ${filterTerm === term ? 'active' : ''}`}
                    onClick={() => handleVisheshSuchiClick(term)}
                  >
                    {term}
                  </button>
                ))}
                {filterTerm && (
                  <button
                    type="button"
                    className="kosh-filter-modal-clear"
                    onClick={() => {
                      clearFilter()
                      setShowFilterModal(false)
                    }}
                  >
                    ✕ फ़िल्टर साफ़ करें
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showContentModal && selectedContent && (
          <>
            <motion.div
              className="kosh-content-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowContentModal(false)
                setSelectedContent(null)
              }}
            />
            <motion.div
              className="kosh-content-modal"
              initial={{ opacity: 0, scale: 0.9, x: '-50%', y: '-50%' }}
              animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
              exit={{ opacity: 0, scale: 0.9, x: '-50%', y: '-50%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{ position: 'fixed', top: '50%', left: '50%' }}
            >
              <div className="kosh-content-modal-header">
                <h3 className="kosh-content-modal-title sanskrit">
                  {selectedContent.hindiWord || 'N/A'}
                </h3>
                <button
                  type="button"
                  className="kosh-content-modal-close"
                  onClick={() => {
                    setShowContentModal(false)
                    setSelectedContent(null)
                  }}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              <div className="kosh-content-modal-body">
                {selectedContent.meaning && (
                  <div
                    className="kosh-content-modal-section sanskrit"
                    dangerouslySetInnerHTML={{ __html: selectedContent.meaning }}
                  />
                )}
                {selectedContent.structure && (
                  <div
                    className="kosh-content-modal-section sanskrit"
                    dangerouslySetInnerHTML={{ __html: selectedContent.structure }}
                  />
                )}
                {selectedContent.extra && (
                  <div
                    className="kosh-content-modal-section kosh-content-modal-extra sanskrit"
                    dangerouslySetInnerHTML={{ __html: selectedContent.extra }}
                  />
                )}
                {!selectedContent.meaning &&
                  !selectedContent.structure &&
                  !selectedContent.extra && (
                    <div className="kosh-content-modal-empty">
                      <p className="sanskrit">कोई विवरण उपलब्ध नहीं</p>
                    </div>
                  )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
