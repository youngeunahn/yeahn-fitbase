'use client'

import { useState } from 'react'
import '../App.css'

export default function TestPage() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testApi = async () => {
    setLoading(true)
    setResult('테스트 중...')
    try {
      // 1. 테스트하려는 엔드포인트: /exercise/plan/search?planTypeCode=SWIM
      // 이 URL이 실제로 존재하는 외부 API인지 확인이 필요합니다.
      // 일단 호출을 시도해보고 결과를 보여줍니다.
      const response = await fetch('/exercise/plan/search?planTypeCode=SWIM')
      
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
