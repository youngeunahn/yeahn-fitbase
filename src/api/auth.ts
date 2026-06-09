import { apiGet, apiPost } from './client'

export interface User {
  userId: string;
  userPwd?: string;
  userName?: string;
  userAuth?: string;
  grpAuth?: string;
  email1?: string;
  email2?: string;
  useYn?: string;
  delYn?: string;
  lockYn?: string;
  loginFailCnt?: string;
  insDt?: string;
  insIp?: string;
}

export interface ResponseDto<T> {
  status: string;
  message: string;
  data: T;
}

const AUTH_KEY = 'fitbase_user';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

function buildAuthUrl(path: string) {
  if (typeof window === 'undefined') {
    return `${API_BASE_URL}${path}`;
  }

  return new URL(path, API_BASE_URL || window.location.origin).toString();
}

export async function login(userId: string, password: string): Promise<User> {
  const formData = new URLSearchParams();
  formData.set('userId', userId);
  formData.set('password', password);

  const response = await fetch(buildAuthUrl('/login'), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
    credentials: 'include'
  });

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('로그인 응답 형식이 올바르지 않습니다.');
  }

  const result = await response.json() as ResponseDto<string>;
  if (response.ok && result.status === 'SUCCESS') {
    const userData: User = { userId: result.data || userId };
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
    }
    return userData;
  }
  
  if (response.status === 401) {
    throw new Error('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
  }

  throw new Error(result.message || '로그인에 실패했습니다. 잠시 후 다시 시도해주세요.');
}

export async function signup(userData: any): Promise<string> {
  const response = await apiPost<ResponseDto<string>>('/api/user/signUp', userData);
  if (response.status === 'SUCCESS') {
    return response.message;
  }
  throw new Error(response.message);
}

export function checkIdDuplicate(userId: string): Promise<ResponseDto<boolean>> {
  return apiGet<ResponseDto<boolean>>('/api/user/check-id', { userId });
}

export async function logout() {
  try {
    await fetch(buildAuthUrl('/logout'), {
      method: 'POST',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });
  } finally {
    // 서버 세션이 이미 없어도 화면의 로그인 캐시는 반드시 지웁니다.
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_KEY);
    }
  }
}

export function clearLocalUser() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_KEY);
  }
}

export function getLocalUser(): User | null {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem(AUTH_KEY);
  if (!user) return null;

  try {
    return JSON.parse(user) as User;
  } catch {
    localStorage.removeItem(AUTH_KEY);
    return null;
  }
}

export function isAuthenticated() {
  return !!getLocalUser();
}
