'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signup, checkIdDuplicate } from '../../api/auth'
import '../../App.css'

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    userId: '',
    userName: '',
    userEmail: '',
    userPwd: '',
    confirmPassword: '',
  })
  const [idChecked, setIdChecked] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData({ ...formData, [id]: value })
    if (id === 'userId') setIdChecked(false)
  }

  const handleCheckId = async () => {
    if (!formData.userId) {
      setError('아이디를 입력해주세요.')
      return
    }
    try {
      const response = await checkIdDuplicate(formData.userId)
      if (response.data) {
        setError('이미 사용 중인 아이디입니다.')
        setIdChecked(false)
      } else {
        alert('사용 가능한 아이디입니다.')
        setIdChecked(true)
        setError('')
      }
    } catch (err: any) {
      setError('아이디 중복 확인 중 오류가 발생했습니다.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!idChecked) {
      setError('아이디 중복 확인이 필요합니다.')
      return
    }

    if (formData.userPwd !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    setLoading(true)

    // 이메일 분리 처리 (example@email.com -> email1: example, email2: email.com)
    const emailParts = formData.userEmail.split('@')
    const email1 = emailParts[0] || ''
    const email2 = emailParts[1] || ''

    try {
      await signup({
        userId: formData.userId,
        userName: formData.userName,
        email1: email1,
        email2: email2,
        userPwd: formData.userPwd,
      })
      alert('회원가입이 완료되었습니다. 로그인해주세요.')
      router.push('/login')
    } catch (err: any) {
      setError(err.message || '회원가입에 실패했습니다.')
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
          <h2>회원가입</h2>
          <p>나만의 운동 루틴을 만들어보세요</p>
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="userId">아이디</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                id="userId"
                type="text"
                placeholder="아이디"
                value={formData.userId}
                onChange={handleChange}
                style={{ flex: 1 }}
                required
              />
              <button 
                type="button" 
                onClick={handleCheckId}
                className="nav-button secondary"
                style={{ padding: '0 12px', height: '48px', whiteSpace: 'nowrap' }}
              >
                중복확인
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="userName">이름</label>
            <input
              id="userName"
              type="text"
              placeholder="이름"
              value={formData.userName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="userEmail">이메일</label>
            <input
              id="userEmail"
              type="email"
              placeholder="example@email.com"
              value={formData.userEmail}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="userPwd">비밀번호</label>
            <input
              id="userPwd"
              type="password"
              placeholder="비밀번호"
              value={formData.userPwd}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">비밀번호 확인</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="비밀번호 확인"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? '가입 처리 중...' : '회원가입'}
          </button>
        </form>

        <div className="auth-footer">
          이미 계정이 있으신가요? <Link href="/login">로그인</Link>
        </div>
      </div>
    </main>
  )
}
