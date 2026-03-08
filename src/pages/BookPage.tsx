import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeftOutlined } from '@ant-design/icons'
import Header from '../components/Header'
import {
  type BookCategory,
  type Book,
  type Chapter,
  type ChapterItem,
} from '../services/bookApi'
import './BookPage.css'

interface BookPageProps {
  basePath: string
  eyebrow?: string
  fetchCategories: () => Promise<BookCategory[]>
  fetchByCategory: (catId: number | string) => Promise<Book[]>
  fetchChapters: (catId: number | string, bookId: number | string) => Promise<Chapter[]>
  fetchContent: (catId: number | string, bookId: number | string, chapId: number | string) => Promise<ChapterItem[]>
}

export default function BookPage({
  basePath,
  eyebrow = 'पवित्र ग्रंथ',
  fetchCategories,
  fetchByCategory,
  fetchChapters,
  fetchContent,
}: BookPageProps) {
  const { categoryId, bookId, chapterId } = useParams<{
    categoryId?: string
    bookId?: string
    chapterId?: string
  }>()
  const navigate = useNavigate()

  const [categories, setCategories] = useState<BookCategory[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [content, setContent] = useState<ChapterItem[]>([])

  const [selectedCategory, setSelectedCategory] = useState<BookCategory | null>(null)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'latest' | 'name' | 'name-desc'>('latest')
  const [showIndex, setShowIndex] = useState(false)
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set())
  const [bookChapterCounts, setBookChapterCounts] = useState<Record<number, number>>({})

  // Load categories
  useEffect(() => {
    setLoading(true)
    fetchCategories()
      .then((data) => {
        setCategories(data)
        setError(null)
      })
      .catch((err) => setError(err.message || 'Failed to load categories'))
      .finally(() => setLoading(false))
  }, [])  // eslint-disable-line

  // Load books
  useEffect(() => {
    if (!categoryId) {
      setBooks([])
      setSelectedCategory(null)
      return
    }
    setLoading(true)
    fetchByCategory(categoryId)
      .then(async (data) => {
        setBooks(data)
        let cats = categories
        if (cats.length === 0) {
          cats = await fetchCategories()
          setCategories(cats)
        }
        setSelectedCategory(cats.find((c) => c.id === Number(categoryId)) ?? null)
        setError(null)
      })
      .catch((err) => setError(err.message || 'Failed to load books'))
      .finally(() => setLoading(false))
  }, [categoryId])  // eslint-disable-line

  // Load chapters
  useEffect(() => {
    if (!categoryId || !bookId) {
      setChapters([])
      setSelectedBook(null)
      return
    }
    setLoading(true)
    fetchChapters(categoryId, bookId)
      .then(async (data) => {
        setChapters(data)
        let bks = books
        if (bks.length === 0) {
          bks = await fetchByCategory(categoryId)
          setBooks(bks)
        }
        setSelectedBook(bks.find((b) => b.id === Number(bookId)) ?? null)
        setError(null)
      })
      .catch((err) => setError(err.message || 'Failed to load chapters'))
      .finally(() => setLoading(false))
  }, [categoryId, bookId])  // eslint-disable-line

  // Load chapter content
  useEffect(() => {
    if (!categoryId || !bookId || !chapterId) {
      setContent([])
      setSelectedChapter(null)
      return
    }
    setLoading(true)
    fetchContent(categoryId, bookId, chapterId)
      .then(async (data) => {
        setContent(data)
        let chaps = chapters
        if (chaps.length === 0) {
          chaps = await fetchChapters(categoryId, bookId)
          setChapters(chaps)
        }
        setSelectedChapter(chaps.find((c) => c.id === Number(chapterId)) ?? null)
        setError(null)
      })
      .catch((err) => setError(err.message || 'Failed to load content'))
      .finally(() => setLoading(false))
  }, [categoryId, bookId, chapterId])  // eslint-disable-line

  // Helpers
  const getImageUrl = (img?: string) => {
    if (!img) return ''
    if (img.startsWith('http')) return img
    return `https://samtacore.com${img}`
  }

  const filterItems = <T extends { name?: string }>(items: T[], q: string): T[] => {
    if (!q) return items
    const lower = q.toLowerCase()
    return items.filter((i) => (i.name ?? '').toLowerCase().includes(lower))
  }

  const sortItems = <T extends { id?: number; name?: string }>(items: T[], s: string): T[] => {
    const arr = [...items]
    if (s === 'name') return arr.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))
    if (s === 'name-desc') return arr.sort((a, b) => (b.name ?? '').localeCompare(a.name ?? ''))
    return arr.sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
  }

  const toggleExpansion = (id: number) => {
    const next = new Set(expandedChapters)
    next.has(id) ? next.delete(id) : next.add(id)
    setExpandedChapters(next)
  }

  const filteredCategories = sortItems(filterItems(categories, searchQuery), sortBy)
  const filteredBooks = sortItems(filterItems(books, searchQuery), sortBy)
  const filteredChapters = sortItems(filterItems(chapters, searchQuery), sortBy)
  const filteredContent = searchQuery
    ? content.filter((item) => {
        const t = ((item.title_hn ?? '') + ' ' + (item.title_en ?? '')).toLowerCase()
        return t.includes(searchQuery.toLowerCase())
      })
    : content

  const renderContentItem = (item: ChapterItem) => (
    <motion.div
      key={item._id ?? item.id}
      className="bp-content-item"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {item.title_hn && <h3 className="bp-content-title sanskrit">{item.title_hn}</h3>}
      {item.title_en && !item.title_hn && <h3 className="bp-content-title">{item.title_en}</h3>}
      {item.meaning && (
        <div className="bp-content-section">
          <h4 className="bp-content-label">अर्थ</h4>
          <div className="bp-content-text" dangerouslySetInnerHTML={{ __html: item.meaning }} />
        </div>
      )}
      {item.details && (
        <div className="bp-content-section">
          <h4 className="bp-content-label">विवरण</h4>
          <div className="bp-content-text" dangerouslySetInnerHTML={{ __html: item.details }} />
        </div>
      )}
      {item.extra && (
        <div className="bp-content-section">
          <h4 className="bp-content-label">अतिरिक्त</h4>
          <div className="bp-content-text" dangerouslySetInnerHTML={{ __html: item.extra }} />
        </div>
      )}
    </motion.div>
  )

  const pageTitle = selectedChapter?.name ?? selectedBook?.name ?? selectedCategory?.name ?? 'Sacred Texts'

  return (
    <div className="bp-wrap">
      <Header />
      <main className="bp-main">
        <div className="bp-container">
          {/* Back link */}
          <div className="bp-back">
            <Link to="/" className="bp-back-link">
              <ArrowLeftOutlined /> Back to Home
            </Link>
          </div>

          {/* Breadcrumb */}
          {(selectedCategory || selectedBook || selectedChapter) && (
            <motion.nav
              className="bp-breadcrumb"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link to={basePath} className="bp-breadcrumb-link">ग्रंथ</Link>
              {selectedCategory && (
                <>
                  <span className="bp-breadcrumb-sep">›</span>
                  {bookId ? (
                    <Link to={`${basePath}/${categoryId}`} className="bp-breadcrumb-link">
                      {selectedCategory.name}
                    </Link>
                  ) : (
                    <span className="bp-breadcrumb-cur sanskrit">{selectedCategory.name}</span>
                  )}
                </>
              )}
              {selectedBook && (
                <>
                  <span className="bp-breadcrumb-sep">›</span>
                  {chapterId ? (
                    <Link to={`${basePath}/${categoryId}/${bookId}`} className="bp-breadcrumb-link">
                      {selectedBook.name}
                    </Link>
                  ) : (
                    <span className="bp-breadcrumb-cur sanskrit">{selectedBook.name}</span>
                  )}
                </>
              )}
              {selectedChapter && (
                <>
                  <span className="bp-breadcrumb-sep">›</span>
                  <span className="bp-breadcrumb-cur sanskrit">{selectedChapter.name}</span>
                </>
              )}
            </motion.nav>
          )}

          {/* Page header */}
          <motion.div
            className="bp-page-header"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <span className="bp-eyebrow sanskrit">{eyebrow}</span>
            <h1 className="bp-page-title display-heading">{pageTitle}</h1>
          </motion.div>

          {/* Loading */}
          {loading && (
            <div className="bp-state">
              <div className="bp-spinner" />
              <p>लोड हो रहा है...</p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="bp-state bp-error">
              <p>त्रुटि: {error}</p>
            </div>
          )}

          {/* Filter bar */}
          {!loading && (
            <motion.div
              className="bp-filter-bar"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              <div className="bp-search-wrap">
                <input
                  type="text"
                  placeholder="खोजें..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bp-search-input"
                />
                <svg className="bp-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
              </div>
              <div className="bp-filter-controls">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className="bp-sort-select">
                  <option value="latest">क्रमानुसार</option>
                  <option value="name">नाम (आरोही)</option>
                  <option value="name-desc">नाम (अवरोही)</option>
                </select>
                {chapterId && (
                  <button className={`bp-index-btn${showIndex ? ' active' : ''}`} onClick={() => setShowIndex(!showIndex)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" />
                    </svg>
                    <span>सूची</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* Categories view */}
          {!categoryId && !loading && filteredCategories.length > 0 && (
            <>
              <motion.div
                className="bp-category-tabs"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="bp-tabs-scroll">
                  {filteredCategories.map((cat) => (
                    <button key={cat.id} className="bp-tab" onClick={() => navigate(`${basePath}/${cat.id}`)}>
                      <span className="sanskrit">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="bp-categories-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.25 }}
              >
                {filteredCategories.map((cat) => (
                  <motion.div
                    key={cat.id}
                    className="bp-category-card"
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`${basePath}/${cat.id}`)}
                  >
                    <div className="bp-cat-image-wrap">
                      {cat.cover_image ? (
                        <img src={getImageUrl(cat.cover_image)} alt={cat.name} className="bp-cat-image"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
                      ) : (
                        <div className="bp-cat-placeholder">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                          </svg>
                        </div>
                      )}
                      <div className="bp-cat-overlay" />
                    </div>
                    <div className="bp-cat-info">
                      <h3 className="bp-cat-name sanskrit">{cat.name}</h3>
                      <div className="bp-cat-read">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                        </svg>
                        <span>पढ़ें</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}

          {/* Books view */}
          {categoryId && !bookId && !loading && filteredBooks.length > 0 && (
            <>
              <motion.div
                className="bp-category-tabs"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="bp-tabs-scroll">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      className={`bp-tab${Number(categoryId) === cat.id ? ' active' : ''}`}
                      onClick={() => navigate(`${basePath}/${cat.id}`)}
                    >
                      <span className="sanskrit">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="bp-books-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.25 }}
              >
                {filteredBooks.map((book) => {
                  const count = bookChapterCounts[book.id]
                  if (count === undefined) {
                    fetchChapters(categoryId, book.id)
                      .then((chs) => setBookChapterCounts((prev) => ({ ...prev, [book.id]: chs.length })))
                      .catch(() => setBookChapterCounts((prev) => ({ ...prev, [book.id]: 0 })))
                  }
                  const hasChapters = count !== 0
                  return (
                    <motion.div
                      key={book.id}
                      className="bp-book-row"
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => hasChapters && navigate(`${basePath}/${categoryId}/${book.id}`)}
                    >
                      <div className="bp-book-cover">
                        {book.book_image ? (
                          <img src={getImageUrl(book.book_image)} alt={book.name} className="bp-book-img"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
                        ) : (
                          <div className="bp-book-img-placeholder">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="bp-book-info">
                        <h3 className="bp-book-title sanskrit">{book.name}</h3>
                        <div className="bp-book-meta">
                          <span>अध्याय: {typeof count === 'number' ? count : '...'}</span>
                          <span className="bp-book-lang">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
                              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                            </svg>
                            हिंदी / संस्कृत
                          </span>
                        </div>
                      </div>
                      {hasChapters && (
                        <button
                          className="bp-book-read-btn"
                          onClick={(e) => { e.stopPropagation(); navigate(`${basePath}/${categoryId}/${book.id}`) }}
                        >
                          पढ़ें
                        </button>
                      )}
                    </motion.div>
                  )
                })}
              </motion.div>
            </>
          )}

          {/* Chapters view */}
          {categoryId && bookId && !chapterId && !loading && filteredChapters.length > 0 && (
            <>
              <AnimatePresence>
                {showIndex && (
                  <motion.div
                    className="bp-index-panel"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="bp-index-title">सूची</h3>
                    <p className="bp-index-subtitle">अध्याय पर क्लिक करके पढ़ना शुरू करें</p>
                    <div className="bp-index-list">
                      {filteredChapters.map((ch, idx) => {
                        const isExp = expandedChapters.has(ch.id)
                        return (
                          <div key={ch.id} className="bp-index-item">
                            <div className="bp-index-item-header" onClick={() => toggleExpansion(ch.id)}>
                              <span className="bp-index-num">{idx + 1}</span>
                              <span className="bp-index-name sanskrit">{ch.name}</span>
                              <span className="bp-index-toggle">{isExp ? '−' : '+'}</span>
                            </div>
                            {isExp && (
                              <div className="bp-index-item-body">
                                <span
                                  className="bp-index-start-link"
                                  onClick={() => navigate(`${basePath}/${categoryId}/${bookId}/${ch.id}`)}
                                >
                                  पढ़ना शुरू करें →
                                </span>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                className="bp-chapters-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                {filteredChapters.map((ch, idx) => (
                  <motion.div
                    key={ch.id}
                    className="bp-chapter-row"
                    whileHover={{ x: 8 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`${basePath}/${categoryId}/${bookId}/${ch.id}`)}
                  >
                    <div className="bp-chapter-num">{idx + 1}</div>
                    <div className="bp-chapter-body">
                      <h3 className="bp-chapter-name sanskrit">{ch.name}</h3>
                    </div>
                    <div className="bp-chapter-arrow">→</div>
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}

          {/* Content view */}
          {categoryId && bookId && chapterId && !loading && (
            <div className="bp-content-wrap">
              <AnimatePresence>
                {showIndex && chapters.length > 0 && (
                  <motion.div
                    className="bp-content-index"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="bp-content-index-title">सूची</h3>
                    <div className="bp-content-index-list">
                      {chapters.map((ch, idx) => (
                        <div
                          key={ch.id}
                        className={`bp-content-index-item${Number(chapterId) === ch.id ? ' active' : ''}`}
                        onClick={() => navigate(`${basePath}/${categoryId}/${bookId}/${ch.id}`)}
                        >
                          <span className="bp-cil-num">{idx + 1}</span>
                          <span className="bp-cil-name sanskrit">{ch.name}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {filteredContent.length > 0 && (
                <motion.div
                  className={`bp-content-container${showIndex ? ' with-index' : ''}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <AnimatePresence>
                    {filteredContent.map((item) => renderContentItem(item))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          )}

          {/* Empty states */}
          {!loading && !error && (
            <>
              {!categoryId && categories.length === 0 && (
                <div className="bp-state"><p className="sanskrit">कोई श्रेणी उपलब्ध नहीं</p></div>
              )}
              {categoryId && !bookId && books.length === 0 && (
                <div className="bp-state"><p className="sanskrit">कोई पुस्तक उपलब्ध नहीं</p></div>
              )}
              {categoryId && bookId && !chapterId && chapters.length === 0 && (
                <div className="bp-state"><p className="sanskrit">कोई अध्याय उपलब्ध नहीं</p></div>
              )}
              {categoryId && bookId && chapterId && content.length === 0 && (
                <div className="bp-state"><p className="sanskrit">कोई सामग्री उपलब्ध नहीं</p></div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
