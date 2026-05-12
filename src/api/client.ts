const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''
const INTERNAL_API_URL = process.env.INTERNAL_API_URL || 'http://localhost:8080'

export async function apiGet<T>(path: string, params: Record<string, string | number | boolean | undefined | null> = {}): Promise<T> {
  // 서버 사이드에서는 절대 경로가 필요할 수 있음
  const isServer = typeof window === 'undefined'
  const baseUrl = isServer ? INTERNAL_API_URL : (API_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : ''))
  
  const url = new URL(`${baseUrl}${path}`)

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value))
    }
  })

  const response = await fetch(url.toString(), {
    // Next.js 캐싱 옵션 등을 추가할 수 있음
    next: { revalidate: 0 } // 일단 항상 신선한 데이터를 가져오도록 설정
  } as RequestInit)

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`)
  }

  return response.json() as Promise<T>
}
