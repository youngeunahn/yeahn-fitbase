import { getTemplates, Template } from '../api/templates'
import TypeCodeSelector from '../components/TypeCodeSelector'
import Link from 'next/link'
import '../App.css'

interface PageProps {
  searchParams: Promise<{ typeCode?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const typeCode = resolvedParams.typeCode || 'SWIM'
  
  let templates: Template[] = []
  let error = false

  try {
    templates = await getTemplates({ typeCode })
  } catch (e) {
    console.error('Failed to fetch templates:', e)
    error = true
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
            <Link href="/login" className="nav-button secondary">로그인</Link>
            <Link href="/signup" className="nav-button primary">회원가입</Link>
          </nav>
          <TypeCodeSelector initialTypeCode={typeCode} />
        </div>
      </header>

      <section className="content-panel">
        {error && (
          <p className="state-text">
            API connection failed. Check that Spring Boot is running on port 8080.
          </p>
        )}
        {!error && templates.length === 0 && (
          <p className="state-text">No templates found.</p>
        )}
        {!error && templates.length > 0 && (
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
