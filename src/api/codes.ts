import { apiGet } from './client'
import type { ResponseDto } from './auth'

export interface CodeOption {
  label: string;
  value: string;
}

type RawCodeOption = {
  code?: string;
  codeValue?: string;
  value?: string;
  commonCode?: string;
  cd?: string;
  codeName?: string;
  name?: string;
  label?: string;
  commonCodeName?: string;
  cdNm?: string;
}

export const PLAN_CODE_GROUPS = {
  phase: 'PLAN_PHASE',
  category: 'PLAN_CATEGORY',
  type: 'PLAN_TYPE',
} as const

function normalizeCodeOption(option: RawCodeOption): CodeOption | null {
  const value = option.codeValue ?? option.code ?? option.value ?? option.commonCode ?? option.cd
  const label = option.codeName ?? option.name ?? option.label ?? option.commonCodeName ?? option.cdNm ?? value

  if (!value || !label) {
    return null
  }

  return {
    value: String(value),
    label: String(label),
  }
}

export async function fetchCodeOptions(groupCode: string, params: Record<string, string | number | boolean | undefined | null> = {}) {
  const response = await apiGet<ResponseDto<RawCodeOption[]>>('/api/user/codes', { groupCode, ...params })
  if (response.status !== 'SUCCESS') {
    throw new Error(response.message || '코드 목록을 불러오지 못했습니다.')
  }

  return response.data
    .map(normalizeCodeOption)
    .filter((option): option is CodeOption => option !== null)
}

export async function fetchPlanCodeOptions() {
  const [phaseOptions, typeOptions] = await Promise.all([
    fetchCodeOptions(PLAN_CODE_GROUPS.phase),
    fetchCodeOptions(PLAN_CODE_GROUPS.type),
  ])

  return {
    phaseOptions,
    typeOptions,
  }
}

export function fetchPlanCategoryOptions(typeCode: string) {
  return fetchCodeOptions(PLAN_CODE_GROUPS.category, { typeCode })
}
