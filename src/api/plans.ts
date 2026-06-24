import { apiGet, apiPost } from './client'
import type { ResponseDto } from './auth'

export interface PlanDetail {
  planDetailSeq: number | null;
  planPhase: string;
  planCategoryCode: string;
  planKindCode: string;
  planExerName: string;
  planSets: string;
  planReps: string;
  planNote: string;
  planTotalDistance: string;
}

export interface Plan {
  planSeq: number | null;
  planName: string;
  planDate: string;
  planTypeCode: string;
  details: PlanDetail[];
}

export function savePlan(plan: Plan) {
  return apiPost<ResponseDto<number>>('/api/user/plans', plan)
}

export async function fetchPlans() {
  const response = await apiGet<ResponseDto<Plan[]>>('/api/user/plans')
  if (response.status === 'SUCCESS') {
    return response.data
  }

  throw new Error(response.message || '운동계획 목록을 불러오지 못했습니다.')
}
