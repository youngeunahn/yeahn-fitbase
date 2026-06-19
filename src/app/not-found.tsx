import Link from 'next/link'

export default function NotFound() {
  return (
    <main style={{ minHeight: '100vh', padding: '48px 20px', textAlign: 'center' }}>
      <h1>페이지를 찾을 수 없습니다</h1>
      <p style={{ color: '#62726b' }}>요청한 페이지가 없거나 이동되었습니다.</p>
      <Link href="/" style={{ color: '#863bff', fontWeight: 700 }}>
        홈으로 이동
      </Link>
    </main>
  )
}
