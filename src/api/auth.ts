import { apiGet, apiPost } from './client'

export interface User {
  userId: string;
  userPwd?: string;
  userName?: string;
  userAuth?: string;
  role?: string;
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

export interface UserTokenResponse {
  tokenType: string;
  accessToken: string;
  expiresIn: number;
  userId: string;
  userName: string;
  role: string;
}

const AUTH_KEY = 'fitbase_user';
const TOKEN_KEY = 'fitbase_token';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

function buildAuthUrl(path: string) {
  if (typeof window === 'undefined') {
    return `${API_BASE_URL}${path}`;
  }

  return new URL(path, API_BASE_URL || window.location.origin).toString();
}

export async function login(userId: string, password: string): Promise<User> {
  const response = await fetch(buildAuthUrl('/api/user/login'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, password }),
  });

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('로그인 응답 형식이 올바르지 않습니다.');
  }

  const result = await response.json() as ResponseDto<UserTokenResponse>;
  if (response.ok && result.status === 'SUCCESS') {
    const token = result.data;
    const userData: User = {
      userId: token.userId,
      userName: token.userName,
      userAuth: token.role,
      role: token.role,
    };
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
      localStorage.setItem(TOKEN_KEY, token.accessToken);
    }
    return userData;
  }
  
  if (response.status === 401) {
    throw new Error('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
  }

  throw new Error(result.message || '로그인에 실패했습니다. 잠시 후 다시 시도해주세요.');
}

export async function fetchCurrentUser(): Promise<User> {
  const token = getAccessToken();
  if (!token) {
    throw new Error('로그인이 필요합니다.');
  }

  const response = await fetch(buildAuthUrl('/api/user/me'), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    clearLocalUser();
    throw new Error('로그인이 필요합니다.');
  }

  if (!response.ok) {
    throw new Error('사용자 정보를 불러오지 못했습니다.');
  }

  const result = await response.json() as ResponseDto<User>;
  if (result.status !== 'SUCCESS') {
    throw new Error(result.message || '사용자 정보를 불러오지 못했습니다.');
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_KEY, JSON.stringify(result.data));
  }

  return result.data;
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
  clearLocalUser();
}

export function clearLocalUser() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
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
  return !!getLocalUser() && !!getAccessToken();
}
