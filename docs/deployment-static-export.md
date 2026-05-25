# Static Export Deployment Notes

## 현재 배포 방식

이 프로젝트는 `next.config.mjs`에서 `output: 'export'`를 사용합니다. `npm run build`를 실행하면 정적 배포 산출물이 `out/` 디렉터리에 생성됩니다. 배포 환경이 `./out/*`를 복사하는 방식이면 이 설정이 필요합니다.

## 중요한 제약

정적 export에서는 Next.js 서버가 실행되지 않으므로 `next.config.mjs`의 `rewrites()`를 사용할 수 없습니다. 따라서 `/api` 또는 `/login` 같은 상대 경로 요청은 자동으로 백엔드에 프록시되지 않습니다.

Cloudtype이 `out/` 정적 파일만 서빙하는 경우 다음 문제가 발생할 수 있습니다.

- `POST /login` -> `/login/` 301 redirect
- `POST /login/` -> 정적 서버가 처리해서 `405 Method Not Allowed`

이 경우 프론트 서버가 아니라 백엔드 운영 주소로 직접 요청해야 합니다.

## 필수 환경 변수

운영 배포에서는 프론트 빌드 환경에 다음 값을 설정합니다.

```text
NEXT_PUBLIC_API_BASE_URL=https://백엔드-운영주소
```

이 값은 빌드 시점에 브라우저 번들에 포함됩니다. Cloudtype에서 값을 변경했다면 반드시 다시 빌드/재배포해야 합니다.

## 현재 코드 동작

- `src/api/client.ts`: `NEXT_PUBLIC_API_BASE_URL`이 있으면 API 요청을 해당 백엔드 주소로 보냅니다.
- `src/api/auth.ts`: 로그인 요청도 `NEXT_PUBLIC_API_BASE_URL + '/login'`으로 보냅니다.
- `next.config.mjs`: `output: 'export'`, `trailingSlash: true`로 정적 라우팅 산출물을 생성합니다.

## 점검 순서

1. Cloudtype 프론트 환경 변수에 `NEXT_PUBLIC_API_BASE_URL`이 있는지 확인합니다.
2. 환경 변수 값이 백엔드 운영 주소인지 확인합니다.
3. 환경 변수 변경 후 프론트를 재배포합니다.
4. 브라우저 Network 탭에서 로그인 요청 URL이 프론트 주소가 아니라 백엔드 주소인지 확인합니다.
5. 백엔드 CORS와 쿠키 설정이 프론트 운영 도메인을 허용하는지 확인합니다.
