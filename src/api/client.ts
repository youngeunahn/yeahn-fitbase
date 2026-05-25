const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''
const INTERNAL_API_URL = process.env.INTERNAL_API_URL || process.env.BACKEND_ORIGIN || 'http://localhost:8080'

export async function apiGet<T>(path: string, params: Record<string, string | number | boolean | undefined | null> = {}): Promise<T> {
  const isServer = typeof window === 'undefined'
  const baseUrl = isServer ? INTERNAL_API_URL : (API_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : ''))
  
  const url = new URL(`${baseUrl}${path}`)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value))
    }
  })

  const response = await fetch(url.toString(), {
    next: { revalidate: 0 },
    credentials: 'include' // 세션 쿠키 전송을 위해 추가
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
  const isServer = typeof window === 'undefined'
  const baseUrl = isServer ? INTERNAL_API_URL : (API_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : ''))
  
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    credentials: 'include' // 세션 쿠키 전송을 위해 추가
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
