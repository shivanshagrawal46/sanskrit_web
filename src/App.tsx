import { Routes, Route } from 'react-router-dom'
import { Layout } from 'antd'
import Header from './components/Header'
import Hero from './components/Hero'
import LearningTreasury from './components/LearningTreasury'
import DivineQuotesSection from './components/DivineQuotesSection.tsx'
import CommunitySection from './components/CommunitySection'
import InspirationSection from './components/InspirationSection'
import AppDownloadSection from './components/AppDownloadSection'
import Footer from './components/Footer'
import KoshPage from './pages/KoshPage'
import DivineQuotesPage from './pages/DivineQuotesPage.tsx'
import BookPage from './pages/BookPage.tsx'
import {
  fetchBookCategories,
  fetchBooksByCategory,
  fetchChaptersByBook,
  fetchChapterContent,
  fetchLitBookCategories,
  fetchLitBooksByCategory,
  fetchLitChaptersByBook,
  fetchLitChapterContent,
} from './services/bookApi'
import './App.css'

function HomePage() {
  return (
    <Layout className="app-layout">
      <Header />
      <Layout.Content className="app-content">
        <Hero />
        <LearningTreasury />
        <DivineQuotesSection />
        <CommunitySection />
        <InspirationSection />
        <AppDownloadSection />
        <Footer />
      </Layout.Content>
    </Layout>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dictionary" element={<KoshPage />} />
      <Route path="/verb-forms" element={<KoshPage />} />
      <Route path="/anthology" element={<KoshPage />} />
      <Route path="/learn" element={<KoshPage />} />
      <Route path="/word-forms" element={<KoshPage />} />
      <Route path="/suffixes" element={<KoshPage />} />
      <Route path="/divine-quotes" element={<DivineQuotesPage />} />
      <Route path="/sacred-texts" element={<BookPage basePath="/sacred-texts" eyebrow="पवित्र ग्रंथ" fetchCategories={fetchBookCategories} fetchByCategory={fetchBooksByCategory} fetchChapters={fetchChaptersByBook} fetchContent={fetchChapterContent} />} />
      <Route path="/sacred-texts/:categoryId" element={<BookPage basePath="/sacred-texts" eyebrow="पवित्र ग्रंथ" fetchCategories={fetchBookCategories} fetchByCategory={fetchBooksByCategory} fetchChapters={fetchChaptersByBook} fetchContent={fetchChapterContent} />} />
      <Route path="/sacred-texts/:categoryId/:bookId" element={<BookPage basePath="/sacred-texts" eyebrow="पवित्र ग्रंथ" fetchCategories={fetchBookCategories} fetchByCategory={fetchBooksByCategory} fetchChapters={fetchChaptersByBook} fetchContent={fetchChapterContent} />} />
      <Route path="/sacred-texts/:categoryId/:bookId/:chapterId" element={<BookPage basePath="/sacred-texts" eyebrow="पवित्र ग्रंथ" fetchCategories={fetchBookCategories} fetchByCategory={fetchBooksByCategory} fetchChapters={fetchChaptersByBook} fetchContent={fetchChapterContent} />} />
      <Route path="/books" element={<BookPage basePath="/books" eyebrow="पुस्तकानि" fetchCategories={fetchLitBookCategories} fetchByCategory={fetchLitBooksByCategory} fetchChapters={fetchLitChaptersByBook} fetchContent={fetchLitChapterContent} />} />
      <Route path="/books/:categoryId" element={<BookPage basePath="/books" eyebrow="पुस्तकानि" fetchCategories={fetchLitBookCategories} fetchByCategory={fetchLitBooksByCategory} fetchChapters={fetchLitChaptersByBook} fetchContent={fetchLitChapterContent} />} />
      <Route path="/books/:categoryId/:bookId" element={<BookPage basePath="/books" eyebrow="पुस्तकानि" fetchCategories={fetchLitBookCategories} fetchByCategory={fetchLitBooksByCategory} fetchChapters={fetchLitChaptersByBook} fetchContent={fetchLitChapterContent} />} />
      <Route path="/books/:categoryId/:bookId/:chapterId" element={<BookPage basePath="/books" eyebrow="पुस्तकानि" fetchCategories={fetchLitBookCategories} fetchByCategory={fetchLitBooksByCategory} fetchChapters={fetchLitChaptersByBook} fetchContent={fetchLitChapterContent} />} />
    </Routes>
  )
}

export default App
