'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { fetchCurrentUser, login } from '../../api/auth'
import '../../App.css'

export default function LoginPage() {
  const router = useRouter()
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true

    fetchCurrentUser()
      .then(() => {
        if (mounted) {
          router.replace('/plan/add')
        }
      })
      .catch(() => {
        // 로그인 페이지는 인증되지 않은 상태가 정상 진입 경로다.
      })

    return () => {
      mounted = false
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(userId, password)
      router.replace('/plan/add')
    } catch (err: any) {
      setError(err.message || '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <Image
            className="auth-logo"
            src="/logo.png"
            alt="FitBase"
            width={440}
            height={125}
            priority
            unoptimized
          />
          <h2>로그인</h2>
          <p>운동 관리를 시작해보세요</p>
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="userId">아이디</label>
            <input
              id="userId"
              type="text"
              placeholder="아이디를 입력하세요"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="password">비밀번호</label>
              <Link href="#" className="forgot-password" style={{ fontSize: '12px', color: '#863bff', textDecoration: 'none' }}>
                비밀번호를 잊으셨나요?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="auth-footer">
          계정이 없으신가요? <Link href="/signup">회원가입</Link>
        </div>
      </div>
    </main>
  )
}
