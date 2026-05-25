'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { getTemplates, Template } from '../api/templates'
import { isAuthenticated, logout } from '../api/auth'
import TypeCodeSelector from '../components/TypeCodeSelector'
import Link from 'next/link'
import '../App.css'

function PageContent() {
  const searchParams = useSearchParams()
  const typeCode = searchParams.get('typeCode') || 'SWIM'
  
  const [templates, setTemplates] = useState<Template[]>([])
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setIsLoggedIn(isAuthenticated())
    
    const fetchTemplates = async () => {
      setLoading(true)
      try {
        const data = await getTemplates({ typeCode })
        setTemplates(data)
        setError(false)
      } catch (e) {
        console.error('Failed to fetch templates:', e)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchTemplates()
  }, [typeCode])

  const handleLogout = () => {
    logout()
    setIsLoggedIn(false)
    window.location.reload()
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">FitBase (Next.js)</p>
          <h1>Exercise templates</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <nav className="nav-links">
            {isLoggedIn ? (
              <>
                <Link href="/plan/add" className="nav-button primary">운동계획 추가</Link>
                <button onClick={handleLogout} className="nav-button secondary" style={{ cursor: 'pointer', border: '1px solid #d7e1dc' }}>로그아웃</button>
              </>
            ) : (
              <>
                <Link href="/login" className="nav-button secondary">로그인</Link>
                <Link href="/signup" className="nav-button primary">회원가입</Link>
              </>
            )}
            <Link href="/test" className="nav-button secondary">테스트</Link>
          </nav>
          <TypeCodeSelector initialTypeCode={typeCode} />
        </div>
      </header>

      <section className="content-panel">
        {loading && <p className="state-text">Loading...</p>}
        {!loading && error && (
          <p className="state-text">
            API connection failed. Check that Spring Boot is running on port 8080.
          </p>
        )}
        {!loading && !error && templates.length === 0 && (
          <p className="state-text">No templates found.</p>
        )}
        {!loading && !error && templates.length > 0 && (
          <ul className="template-list">
            {templates.map((template) => (
              <li key={template.tplSeq ?? `${template.tplName}-${template.tplExerName}`}>
                <div>
                  <strong>{template.tplName || template.tplExerName || 'Untitled'}</strong>
                  <span>{template.tplCategoryDesc || template.tplPhase || typeCode}</span>
                </div>
                {template.tplNote && <p>{template.tplNote}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<main className="app-shell"><p className="state-text">Loading...</p></main>}>
      <PageContent />
    </Suspense>
  )
}
