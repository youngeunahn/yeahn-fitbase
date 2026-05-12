import { apiGet } from './client'

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

export function getTemplates(params: Record<string, string | number | boolean | undefined | null>) {
  return apiGet<Template[]>('/api/user/templates', params)
}
