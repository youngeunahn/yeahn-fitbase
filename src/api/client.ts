const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''
const INTERNAL_API_URL = process.env.INTERNAL_API_URL || process.env.BACKEND_ORIGIN || 'http://localhost:8080'
const TOKEN_KEY = 'fitbase_token'

function buildApiUrl(path: string) {
  if (typeof window === 'undefined') {
    return new URL(path, INTERNAL_API_URL)
  }

  return new URL(path, API_BASE_URL || window.location.origin)
}

function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') {
    return {}
  }

  const token = localStorage.getItem(TOKEN_KEY)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function apiGet<T>(path: string, params: Record<string, string | number | boolean | undefined | null> = {}): Promise<T> {
  const url = buildApiUrl(path)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value))
    }
  })

  const response = await fetch(url.toString(), {
    next: { revalidate: 0 },
    headers: getAuthHeaders(),
  } as RequestInit)

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'No error body')
    throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorBody}`)
  }

  const contentType = response.headers.get('content-type')
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text()
    throw new Error(`Expected JSON response but received ${contentType}. Content: ${text.substring(0, 100)}...`)
  }

  return response.json() as Promise<T>
}

export async function apiPost<T>(path: string, body: any): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...getAuthHeaders() }
  
  const response = await fetch(buildApiUrl(path).toString(), {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'No error body')
    throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorBody}`)
  }

  const contentType = response.headers.get('content-type')
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text()
    throw new Error(`Expected JSON response but received ${contentType}. Content: ${text.substring(0, 100)}...`)
  }

  return response.json() as Promise<T>
}
