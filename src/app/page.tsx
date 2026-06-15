'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { fetchCurrentUser } from '../api/auth'
import heroImage from '../assets/hero.png'
import styles from './page.module.css'

const features = [
  {
    title: '운동 기록을 한곳에',
    description: '수영, 웨이트, 유산소 등 매일의 운동 데이터를 깔끔하게 정리합니다.',
  },
  {
    title: '계획부터 실행까지',
    description: '반복되는 루틴과 목표를 저장하고 다음 운동을 빠르게 준비합니다.',
  },
  {
    title: '성장 흐름 확인',
    description: '누적 기록을 기준으로 컨디션과 수행 변화를 더 쉽게 파악합니다.',
  },
]

const stats = [
  { value: '01', label: '나만의 루틴 설계' },
  { value: '02', label: '운동별 기록 관리' },
  { value: '03', label: '목표 기반 플랜 실행' },
]

export default function Page() {
  const router = useRouter()
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    let mounted = true

    fetchCurrentUser()
      .then(() => {
        if (mounted) {
          router.replace('/plan/add')
        }
      })
      .catch(() => {
        if (mounted) {
          setIsCheckingAuth(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [router])

  if (isCheckingAuth) {
    return null
  }

  return (
    <main className={styles.home}>
      <nav className={styles.nav} aria-label="주요 메뉴">
        <Link href="/" className={styles.brand}>
          <Image
            src="/logo3.png"
            alt="FITBASE"
            width={165}
            height={50}
            priority
            className={styles.brandLogo}
          />
        </Link>
        <div className={styles.navLinks}>
          <Link href="/login">로그인</Link>
          <Link href="/signup" className={styles.navAction}>
            시작하기
          </Link>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>운동 관리의 기준점</p>
          <h1>FITBASE로 운동 계획과 기록을 더 선명하게 관리하세요.</h1>
          <p className={styles.lead}>
            흩어진 운동 루틴, 기록, 목표를 하나의 흐름으로 연결해 꾸준히 움직일 수 있는
            개인 운동 베이스를 만듭니다.
          </p>
          <div className={styles.heroActions}>
            <Link href="/signup" className={styles.primaryButton}>
              무료로 시작하기
            </Link>
            <Link href="/login" className={styles.secondaryButton}>
              로그인
            </Link>
          </div>
        </div>

        <div className={styles.heroVisual} aria-hidden="true">
          <Image src={heroImage} alt="" priority className={styles.heroImage} />
          <div className={styles.metricPanel}>
            <span>이번 주 달성률</span>
            <strong>84%</strong>
          </div>
        </div>
      </section>

      <section className={styles.stats} aria-label="FITBASE 사용 흐름">
        {stats.map((item) => (
          <div key={item.value} className={styles.statItem}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </section>

      <section className={styles.features}>
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Why FITBASE</p>
          <h2>운동을 꾸준히 이어가기 위한 핵심 기능</h2>
        </div>
        <div className={styles.featureGrid}>
          {features.map((feature) => (
            <article key={feature.title} className={styles.featureCard}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
