'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

interface TypeCodeSelectorProps {
  initialTypeCode?: string;
}

export default function TypeCodeSelector({ initialTypeCode }: TypeCodeSelectorProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleTypeCodeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTypeCode = event.target.value
    const params = new URLSearchParams(searchParams.toString())
    params.set('typeCode', newTypeCode)
    router.push(`?${params.toString()}`)
  }

  return (
    <select value={initialTypeCode} onChange={handleTypeCodeChange}>
      <option value="SWIM">SWIM</option>
      <option value="GYM">GYM</option>
    </select>
  )
}
