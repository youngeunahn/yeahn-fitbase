import { apiPost } from './client'

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
  return apiPost<Plan>('/api/exercise/plan/save', plan)
}
