'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { fetchPlans, savePlan, Plan } from '../../../api/plans'
import { fetchCurrentUser, logout } from '../../../api/auth'
import { CodeOption, fetchPlanCategoryOptions, fetchPlanCodeOptions } from '../../../api/codes'
import styles from './page.module.css'
import '../../../App.css'

export default function AddPlanPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [savedPlans, setSavedPlans] = useState<Plan[]>([])
  const [plansLoading, setPlansLoading] = useState(false)
  const [plansError, setPlansError] = useState<string | null>(null)
  const [phaseOptions, setPhaseOptions] = useState<CodeOption[]>([])
  const [categoryOptions, setCategoryOptions] = useState<CodeOption[]>([])
  const [typeOptions, setTypeOptions] = useState<CodeOption[]>([])
  const [optionsLoading, setOptionsLoading] = useState(false)
  const [optionsError, setOptionsError] = useState<string | null>(null)
  const [categoryLoading, setCategoryLoading] = useState(false)
  const [showCategorySpinner, setShowCategorySpinner] = useState(false)
  const [expandedPlanKey, setExpandedPlanKey] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    fetchCurrentUser()
      .then(() => {
        if (mounted) {
          setIsReady(true)
          setOptionsLoading(true)
          fetchPlanCodeOptions()
            .then((options) => {
              if (!mounted) return

              if (!options.phaseOptions.length || !options.typeOptions.length) {
                throw new Error('운동 옵션 코드가 비어 있습니다.')
              }

              const nextPhaseOptions = options.phaseOptions
              const nextTypeOptions = options.typeOptions

              setPhaseOptions(nextPhaseOptions)
              setTypeOptions(nextTypeOptions)
              setOptionsError(null)
              setPlan(prev => ({
                ...prev,
                planTypeCode: nextTypeOptions.some(option => option.value === prev.planTypeCode)
                  ? prev.planTypeCode
                  : nextTypeOptions[0].value,
                details: prev.details.map(detail => ({
                  ...detail,
                  planPhase: nextPhaseOptions.some(option => option.value === detail.planPhase)
                    ? detail.planPhase
                    : nextPhaseOptions[0].value,
                })),
              }))
            })
            .catch((err: Error) => {
              if (mounted) {
                setOptionsError(err.message)
              }
            })
            .finally(() => {
              if (mounted) {
                setOptionsLoading(false)
              }
            })

          setPlansLoading(true)
          fetchPlans()
            .then((plans) => {
              if (mounted) {
                setSavedPlans(plans)
                setPlansError(null)
              }
            })
            .catch((err: Error) => {
              if (mounted) {
                setPlansError(err.message)
              }
            })
            .finally(() => {
              if (mounted) {
                setPlansLoading(false)
              }
            })
        }
      })
      .catch(() => {
        if (mounted) {
          alert('로그인이 필요한 서비스입니다.')
          router.push('/login')
        }
      })

    return () => {
      mounted = false
    }
  }, [router])

  const [plan, setPlan] = useState<Plan>({
    planSeq: null,
    planName: '',
    planDate: new Date().toISOString().split('T')[0],
    planTypeCode: '',
    details: [
      {
        planDetailSeq: null,
        planPhase: '',
        planCategoryCode: '',
        planKindCode: '',
        planExerName: '',
        planSets: '1',
        planReps: '1',
        planNote: '',
        planTotalDistance: '0'
      }
    ]
  })

  useEffect(() => {
    if (!isReady || !plan.planTypeCode) {
      return
    }

    let mounted = true
    setCategoryLoading(true)
    setCategoryOptions([])
    setOptionsError(null)

    fetchPlanCategoryOptions(plan.planTypeCode)
      .then((nextCategoryOptions) => {
        if (!mounted) return

        if (!nextCategoryOptions.length) {
          throw new Error('선택한 운동 타입의 카테고리 코드가 비어 있습니다.')
        }

        setCategoryOptions(nextCategoryOptions)
        setPlan(prev => ({
          ...prev,
          details: prev.details.map(detail => ({
            ...detail,
            planCategoryCode: nextCategoryOptions.some(option => option.value === detail.planCategoryCode)
              ? detail.planCategoryCode
              : nextCategoryOptions[0].value,
          })),
        }))
      })
      .catch((err: Error) => {
        if (mounted) {
          setOptionsError(err.message)
          setCategoryOptions([])
          setPlan(prev => ({
            ...prev,
            details: prev.details.map(detail => ({
              ...detail,
              planCategoryCode: '',
            })),
          }))
        }
      })
      .finally(() => {
        if (mounted) {
          setCategoryLoading(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [isReady, plan.planTypeCode])

  useEffect(() => {
    if (!categoryLoading) {
      setShowCategorySpinner(false)
      return
    }

    const timer = window.setTimeout(() => {
      setShowCategorySpinner(true)
    }, 1000)

    return () => {
      window.clearTimeout(timer)
    }
  }, [categoryLoading])

  const handlePlanChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setPlan(prev => ({
      ...prev,
      [name]: value,
      details: name === 'planTypeCode'
        ? prev.details.map(detail => ({ ...detail, planKindCode: value, planCategoryCode: '' }))
        : prev.details,
    }))
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
          planPhase: phaseOptions[0]?.value ?? '',
          planCategoryCode: categoryOptions[0]?.value ?? '',
          planKindCode: prev.planTypeCode,
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

  const recentPlans = savedPlans.slice(0, 5)
  const typeLabels = Object.fromEntries(typeOptions.map(option => [option.value, option.label]))
  const isOptionsReady = phaseOptions.length > 0 && categoryOptions.length > 0 && typeOptions.length > 0 && !categoryLoading
  const phaseLabels = Object.fromEntries(phaseOptions.map(option => [option.value, option.label]))
  const categoryLabels = Object.fromEntries(categoryOptions.map(option => [option.value, option.label]))

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

      <div className={styles['plan-layout']}>
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
                  placeholder="예: 자유형 지구력 연습"
                  required
                />
              </div>

              <div className={styles['plan-meta-grid']}>
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
                    disabled={optionsLoading || !typeOptions.length}
                    required
                  >
                    <option value="" disabled>운동 타입 선택</option>
                    {typeOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles['section-title']}>
                <span>상세 운동 내역</span>
                <button type="button" onClick={addDetail} className={styles['btn-add-detail']} disabled={!isOptionsReady}>
                  + 항목 추가
                </button>
              </div>
              {showCategorySpinner && (
                <div className={styles['inline-loading']} role="status" aria-live="polite">
                  <span className={styles.spinner} aria-hidden="true" />
                  <span>카테고리를 불러오는 중입니다.</span>
                </div>
              )}
              {optionsError && <p className={styles['options-note']}>{optionsError}</p>}

              <div className={styles['details-table-wrap']}>
                <table className={styles['details-table']}>
                  <thead>
                    <tr>
                      <th style={{ width: '100px' }}>페이즈</th>
                      <th style={{ width: '120px' }}>카테고리</th>
                      <th>운동명</th>
                      <th style={{ width: '60px' }}>세트</th>
                      <th style={{ width: '60px' }}>횟수</th>
                      <th style={{ width: '70px' }}>거리(m)</th>
                      <th>비고</th>
                      <th style={{ width: '40px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {plan.details.map((detail, index) => (
                      <tr key={index}>
                        <td data-label="페이즈">
                          <select name="planPhase" value={detail.planPhase} onChange={(e) => handleDetailChange(index, e)} disabled={optionsLoading || !phaseOptions.length} required>
                            <option value="" disabled>페이즈 선택</option>
                            {phaseOptions.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </td>
                        <td data-label="카테고리">
                          <select name="planCategoryCode" value={detail.planCategoryCode} onChange={(e) => handleDetailChange(index, e)} disabled={optionsLoading || categoryLoading || !categoryOptions.length} required>
                            <option value="" disabled>카테고리 선택</option>
                            {categoryOptions.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </td>
                        <td data-label="운동명">
                          <input
                            type="text"
                            name="planExerName"
                            value={detail.planExerName}
                            onChange={(e) => handleDetailChange(index, e)}
                            placeholder="운동명"
                            required
                          />
                        </td>
                        <td data-label="세트">
                          <input
                            type="text"
                            name="planSets"
                            value={detail.planSets}
                            onChange={(e) => handleDetailChange(index, e)}
                          />
                        </td>
                        <td data-label="횟수">
                          <input
                            type="text"
                            name="planReps"
                            value={detail.planReps}
                            onChange={(e) => handleDetailChange(index, e)}
                          />
                        </td>
                        <td data-label="거리(m)">
                          <input
                            type="text"
                            name="planTotalDistance"
                            value={detail.planTotalDistance}
                            onChange={(e) => handleDetailChange(index, e)}
                          />
                        </td>
                        <td data-label="비고">
                          <input
                            type="text"
                            name="planNote"
                            value={detail.planNote}
                            onChange={(e) => handleDetailChange(index, e)}
                            placeholder="메모"
                          />
                        </td>
                        <td data-label="삭제">
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
                <button type="submit" className={styles['btn-submit']} disabled={loading || !isOptionsReady}>
                  {loading ? '저장 중...' : '계획 저장하기'}
                </button>
              </div>
            </div>
          </form>
        </div>

        <aside className={styles['saved-panel']} aria-labelledby="saved-plan-title">
          <div className={styles['saved-header']}>
            <div>
              <p className={styles['saved-kicker']}>SAVED</p>
              <h2 id="saved-plan-title">저장된 계획</h2>
            </div>
            <span>{savedPlans.length}개</span>
          </div>

          {plansLoading && <p className={styles['saved-state']}>목록을 불러오는 중입니다.</p>}
          {!plansLoading && plansError && <p className={styles['saved-state']}>{plansError}</p>}
          {!plansLoading && !plansError && recentPlans.length === 0 && (
            <p className={styles['saved-state']}>아직 저장된 계획이 없습니다.</p>
          )}
          {!plansLoading && !plansError && recentPlans.length > 0 && (
            <ul className={styles['saved-list']}>
              {recentPlans.map((savedPlan) => {
                const planKey = String(savedPlan.planSeq ?? `${savedPlan.planDate}-${savedPlan.planName}`)
                const isExpanded = expandedPlanKey === planKey

                return (
                  <li key={planKey}>
                    <button
                      type="button"
                      className={styles['saved-plan-button']}
                      onClick={() => setExpandedPlanKey(isExpanded ? null : planKey)}
                      aria-expanded={isExpanded}
                    >
                      <div>
                        <strong>{savedPlan.planName || '이름 없는 계획'}</strong>
                        <span>{savedPlan.planDate} · {typeLabels[savedPlan.planTypeCode] ?? savedPlan.planTypeCode}</span>
                      </div>
                      <small>{savedPlan.details?.length ?? 0}개 운동</small>
                    </button>

                    {isExpanded && (
                      <div className={styles['saved-detail-list']}>
                        {savedPlan.details?.length ? (
                          savedPlan.details.map((detail) => (
                            <div key={detail.planDetailSeq ?? `${detail.planExerName}-${detail.planPhase}`} className={styles['saved-detail-item']}>
                              <strong>{detail.planExerName || '운동명 없음'}</strong>
                              <span>
                                {phaseLabels[detail.planPhase] ?? detail.planPhase} · {categoryLabels[detail.planCategoryCode] ?? detail.planCategoryCode}
                              </span>
                              <small>
                                {detail.planSets}세트 · {detail.planReps}회 · {detail.planTotalDistance}m
                              </small>
                              {detail.planNote && <p>{detail.planNote}</p>}
                            </div>
                          ))
                        ) : (
                          <p className={styles['saved-state']}>상세 운동이 없습니다.</p>
                        )}
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </aside>
      </div>
    </main>
  )
}
