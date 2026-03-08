const isDev =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
const KOSH_API_BASE = isDev ? '/api' : 'https://samtacore.com/api'

export interface KoshSubcategory {
  id: number | string
  name: string
  position?: number
  introduction?: string
  cover_image?: string
  createdAt?: string
}

export interface KoshCategoriesResponse {
  subcategories: KoshSubcategory[]
  currentPage?: number
  totalPages?: number
  totalSubcategories?: number
}

export interface KoshContent {
  id?: string | number
  hindiWord?: string
  meaning?: string
  structure?: string
  extra?: string
  search?: string
}

export interface KoshContentsResponse {
  contents: KoshContent[]
  vishesh_suchi: string[]
  currentPage?: number
  totalPages?: number
  subcategory?: KoshSubcategory
}

export async function fetchKoshCategories(categoryId: number): Promise<KoshCategoriesResponse> {
  const url = `${KOSH_API_BASE}/kosh-category/${categoryId}`
  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    mode: 'cors',
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`)
  }

  const result = await response.json()
  const categoriesList = result.subcategories || result.categories || (Array.isArray(result) ? result : [])
  return { subcategories: categoriesList, ...result }
}

export async function fetchKoshContents(
  mainCategoryId: number,
  subcategoryId: number,
  page = 1
): Promise<KoshContentsResponse> {
  const url = `${KOSH_API_BASE}/kosh-category/${mainCategoryId}/${subcategoryId}?page=${page}`
  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    mode: 'cors',
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch contents: ${response.status} ${response.statusText}`)
  }

  const result = await response.json()
  return {
    contents: result.contents || [],
    vishesh_suchi: result.vishesh_suchi || [],
    totalPages: result.totalPages ?? result.pagination?.totalPages ?? 1,
    currentPage: result.currentPage ?? result.pagination?.currentPage ?? page,
    subcategory: result.subcategory,
  }
}
