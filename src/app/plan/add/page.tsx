'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { savePlan, Plan, PlanDetail } from '../../../api/plans'
import { isAuthenticated, logout } from '../../../api/auth'
import styles from './page.module.css'
import '../../../App.css'

const PHASE_OPTIONS = [
  { label: 'WARM UP', value: 'WARM' },
  { label: 'MAIN', value: 'MAIN' },
  { label: 'COOL DOWN', value: 'COOL' },
]

const CATEGORY_OPTIONS = [
  { label: '자유형', value: 'FREESTYLE' },
  { label: '배영', value: 'BACKSTROKE' },
  { label: '평영', value: 'BREASTSTROKE' },
  { label: '접영', value: 'BUTTERFLY' },
  { label: '혼영', value: 'IM' },
  { label: '기타', value: 'ETC' },
]

const TYPE_OPTIONS = [
  { label: '수영', value: 'SWIM' },
  { label: '웨이트', value: 'GYM' },
]

export default function AddPlanPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      alert('로그인이 필요한 서비스입니다.')
      router.push('/login')
    } else {
      setIsReady(true)
    }
  }, [router])

  const [plan, setPlan] = useState<Plan>({
    planSeq: null,
    planName: '',
    planDate: new Date().toISOString().split('T')[0],
    planTypeCode: 'SWIM',
    details: [
      {
        planDetailSeq: null,
        planPhase: 'MAIN',
        planCategoryCode: 'FREESTYLE',
        planKindCode: 'SWIM',
        planExerName: '',
        planSets: '1',
        planReps: '1',
        planNote: '',
        planTotalDistance: '0'
      }
    ]
  })

  const handlePlanChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setPlan(prev => ({ ...prev, [name]: value }))
  }

  const handleDetailChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const newDetails = [...plan.details]
    newDetails[index] = { ...newDetails[index], [name]: value }
    setPlan(prev => ({ ...prev, details: newDetails }))
  }

  const addDetail = () => {
    setPlan(prev => ({
      ...prev,
      details: [
        ...prev.details,
        {
          planDetailSeq: null,
          planPhase: 'MAIN',
          planCategoryCode: 'FREESTYLE',
          planKindCode: 'SWIM',
          planExerName: '',
          planSets: '1',
          planReps: '1',
          planNote: '',
          planTotalDistance: '0'
        }
      ]
    }))
  }

  const removeDetail = (index: number) => {
    if (plan.details.length === 1) return
    const newDetails = plan.details.filter((_, i) => i !== index)
    setPlan(prev => ({ ...prev, details: newDetails }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await savePlan(plan)
      alert('운동계획이 저장되었습니다.')
      router.push('/')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.replace('/')
  }

  if (!isReady) return null;

  return (
    <main className={styles['plan-container']}>
      <div className="topbar">
        <div>
          <p className="eyebrow">WORKOUT PLAN</p>
          <h1>운동계획 추가</h1>
        </div>
        <button type="button" className="nav-button secondary" onClick={handleLogout}>
          로그아웃
        </button>
      </div>

      <div className={styles['plan-card']}>
        <form onSubmit={handleSubmit}>
          <div className="auth-form">
            <div className="form-group">
              <label>계획 이름</label>
              <input
                type="text"
                name="planName"
                value={plan.planName}
                onChange={handlePlanChange}
                placeholder="예: 자유형 드릴 연습"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>날짜</label>
                <input
                  type="date"
                  name="planDate"
                  value={plan.planDate}
                  onChange={handlePlanChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>운동 타입</label>
                <select
                  name="planTypeCode"
                  value={plan.planTypeCode}
                  onChange={handlePlanChange}
                  style={{ width: '100%' }}
                >
                  {TYPE_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles['section-title']}>
              <span>상세 운동 내역</span>
              <button type="button" onClick={addDetail} className="nav-button secondary" style={{ padding: '4px 12px', fontSize: '13px' }}>
                + 항목 추가
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className={styles['details-table']}>
                <thead>
                  <tr>
                    <th style={{ width: '100px' }}>페이즈</th>
                    <th style={{ width: '120px' }}>카테고리</th>
                    <th>운동명</th>
                    <th style={{ width: '60px' }}>세트</th>
                    <th style={{ width: '60px' }}>회수</th>
                    <th style={{ width: '70px' }}>거리(m)</th>
                    <th>비고</th>
                    <th style={{ width: '40px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {plan.details.map((detail, index) => (
                    <tr key={index}>
                      <td>
                        <select name="planPhase" value={detail.planPhase} onChange={(e) => handleDetailChange(index, e)}>
                          {PHASE_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select name="planCategoryCode" value={detail.planCategoryCode} onChange={(e) => handleDetailChange(index, e)}>
                          {CATEGORY_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          name="planExerName"
                          value={detail.planExerName}
                          onChange={(e) => handleDetailChange(index, e)}
                          placeholder="운동명"
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="planSets"
                          value={detail.planSets}
                          onChange={(e) => handleDetailChange(index, e)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="planReps"
                          value={detail.planReps}
                          onChange={(e) => handleDetailChange(index, e)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="planTotalDistance"
                          value={detail.planTotalDistance}
                          onChange={(e) => handleDetailChange(index, e)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="planNote"
                          value={detail.planNote}
                          onChange={(e) => handleDetailChange(index, e)}
                          placeholder="메모"
                        />
                      </td>
                      <td>
                        <button type="button" onClick={() => removeDetail(index)} className={styles['btn-remove']}>
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className={styles.actions}>
              <Link href="/" className={styles['btn-cancel']}>취소</Link>
              <button type="submit" className={styles['btn-submit']} disabled={loading}>
                {loading ? '저장 중...' : '계획 저장하기'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}
