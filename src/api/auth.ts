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

export async function login(userId: string, password: string): Promise<User> {
  const response = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, password }),
    credentials: 'include'
  });

  // Spring Security는 성공 시 보통 리다이렉트(302)를 보냅니다.
  // fetch는 리다이렉트를 따라간 최종 결과(보통 메인페이지 HTML)를 반환하므로 
  // response.ok 또는 response.redirected가 true이면 성공으로 간주합니다.
  if (response.ok || response.redirected) {
    const userData: User = { userId }; // 세션 방식이므로 최소 정보만 저장
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
    }
    return userData;
  }
  
  throw new Error('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
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

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_KEY);
  }
}

export function getLocalUser(): User | null {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem(AUTH_KEY);
  return user ? JSON.parse(user) : null;
}

export function isAuthenticated() {
  return !!getLocalUser();
}
