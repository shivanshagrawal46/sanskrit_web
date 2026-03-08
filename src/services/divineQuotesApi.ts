const isDev =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')

const API_BASE = isDev ? '/api' : 'https://samtacore.com/api'

export interface DivineQuote {
  _id?: string
  id: number
  quote: string
  meaning: string
  createdAt?: string
  updatedAt?: string
}

export interface DivineQuotesResponse {
  quotes: DivineQuote[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export async function fetchDivineQuotes(page = 1): Promise<DivineQuotesResponse> {
  const url = `${API_BASE}/divine-quotes${page > 1 ? `?page=${page}` : ''}`
  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    mode: 'cors',
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch divine quotes: ${response.status} ${response.statusText}`)
  }

  const result = await response.json()

  return {
    quotes: result.data || [],
    pagination: {
      currentPage: result.pagination?.currentPage ?? 1,
      totalPages: result.pagination?.totalPages ?? 1,
      totalItems: result.pagination?.totalItems ?? 0,
      itemsPerPage: result.pagination?.itemsPerPage ?? 10,
      hasNextPage: result.pagination?.hasNextPage ?? false,
      hasPrevPage: result.pagination?.hasPrevPage ?? false,
    },
  }
}
