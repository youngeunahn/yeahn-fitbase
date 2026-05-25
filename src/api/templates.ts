import { apiGet } from './client'
import type { ResponseDto } from './auth'

export interface Template {
  tplSeq: number;
  tplName?: string;
  tplExerName?: string;
  tplCategoryDesc?: string;
  tplPhase?: string;
  tplNote?: string;
  typeCode: string;
  [key: string]: any;
}

export async function getTemplates(params: Record<string, string | number | boolean | undefined | null>) {
  const response = await apiGet<ResponseDto<Template[]>>('/api/user/templates', params)
  if (response.status === 'SUCCESS') {
    return response.data
  }
  throw new Error(response.message)
}
