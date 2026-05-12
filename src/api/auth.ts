import { apiGet } from './client'

export interface User {
  id: string;
  email: string;
  name?: string;
}

export async function login(email: string, password: string): Promise<{ user: User; token: string }> {
  // 실제 구현 시에는 POST 요청을 사용해야 하며 client.ts에 apiPost 등을 추가해야 할 수 있습니다.
  // 현재 client.ts에는 apiGet만 있으므로, 일단 형식을 맞춥니다.
  console.log('Logging in with:', email)
  
  // 백엔드 API가 준비되었다고 가정하고 fetch 호출 (client.ts의 apiGet을 참고하여 확장 가능)
  const response = await fetch('/api/user/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    throw new Error('Login failed')
  }

  return response.json()
}

export async function signup(userData: any): Promise<{ user: User; token: string }> {
  const response = await fetch('/api/user/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  })

  if (!response.ok) {
    throw new Error('Signup failed')
  }

  return response.json()
}
