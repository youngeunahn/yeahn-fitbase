'use client'

import { useState } from 'react'
import '../../App.css'

export default function TestPage() {
  const [baseUrl, setBaseUrl] = useState(process.env.NEXT_PUBLIC_API_BASE_URL || '')
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testApi = async () => {
    setLoading(true)
    setResult('테스트 중...')
    try {
      const fullUrl = `${baseUrl}/exercise/plan/search?planTypeCode=SWIM`
      const response = await fetch(fullUrl)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (err: any) {
      setResult('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ padding: '20px' }}>
      <h1>API 통신 테스트</h1>
      
      <div style={{ marginBottom: '15px' }}>
        <label>API Base URL: </label>
        <input 
          type="text" 
          value={baseUrl} 
          onChange={(e) => setBaseUrl(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      <button 
        onClick={testApi} 
        disabled={loading}
        style={{ padding: '10px 20px', cursor: 'pointer' }}
      >
        {loading ? '호출 중...' : '호출 시작'}
      </button>
      
      <div style={{ marginTop: '20px', whiteSpace: 'pre-wrap', background: '#f4f4f4', padding: '15px' }}>
        <h3>결과:</h3>
        {result}
      </div>
    </main>
  )
}
