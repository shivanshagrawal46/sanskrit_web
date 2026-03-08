const BASE = '/api'

async function get(path: string) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Accept: 'application/json' },
    mode: 'cors',
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  const json = await res.json()
  return json.success !== undefined ? (json.success ? json.data : []) : (json.data ?? json)
}

export interface BookCategory {
  id: number
  name: string
  cover_image?: string
}

export interface Book {
  id: number
  name: string
  book_image?: string
}

export interface Chapter {
  id: number
  name: string
}

export interface ChapterItem {
  _id?: string
  id?: number
  title_hn?: string
  title_en?: string
  meaning?: string
  details?: string
  extra?: string
}

export const fetchBookCategories = (): Promise<BookCategory[]> =>
  get('/geeta/category')

export const fetchBooksByCategory = (categoryId: number | string): Promise<Book[]> =>
  get(`/geeta/category/${categoryId}`)

export const fetchChaptersByBook = (categoryId: number | string, bookId: number | string): Promise<Chapter[]> =>
  get(`/geeta/category/${categoryId}/${bookId}`)

export const fetchChapterContent = (
  categoryId: number | string,
  bookId: number | string,
  chapterId: number | string
): Promise<ChapterItem[]> =>
  get(`/geeta/category/${categoryId}/${bookId}/${chapterId}`)

// ── /book/category API (साहित्यम्, पुराणानि, वेदाः, स्मृतयः …) ──────────

export const fetchLitBookCategories = (): Promise<BookCategory[]> =>
  get('/book/category')

export const fetchLitBooksByCategory = (categoryId: number | string): Promise<Book[]> =>
  get(`/book/category/${categoryId}`)

export const fetchLitChaptersByBook = (categoryId: number | string, bookId: number | string): Promise<Chapter[]> =>
  get(`/book/category/${categoryId}/${bookId}`)

export const fetchLitChapterContent = (
  categoryId: number | string,
  bookId: number | string,
  chapterId: number | string
): Promise<ChapterItem[]> =>
  get(`/book/category/${categoryId}/${bookId}/${chapterId}`)
