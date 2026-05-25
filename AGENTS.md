# Repository Guidelines

## 프로젝트 구조 및 모듈 구성

이 저장소는 React 19와 TypeScript를 사용하는 Next.js 15 App Router 프로젝트입니다. 라우트 파일은 `src/app/`에 있으며, 예시는 `src/app/page.tsx`, `src/app/login/page.tsx`, `src/app/plan/add/page.tsx`입니다. 재사용 UI 컴포넌트는 `src/components/`에 둡니다. API 관련 코드는 `src/api/`에 모으며, 공통 fetch 래퍼는 `src/api/client.ts`에 있습니다. 전역 스타일은 `src/index.css`를 사용하고, 라우트 단위 스타일은 `src/app/plan/add/page.module.css`처럼 CSS module로 페이지 옆에 둡니다. import해서 쓰는 정적 자산은 `src/assets/`, 직접 제공되는 공개 파일은 `public/`에 둡니다.

## 빌드, 테스트, 개발 명령어

- `npm install`: `package-lock.json` 기준으로 의존성을 설치합니다.
- `npm run dev`: 로컬 Next.js 개발 서버를 실행합니다. 기본 주소는 보통 `http://localhost:3000`입니다.
- `npm run build`: 프로덕션 빌드를 만들고 TypeScript/Next 빌드 검사를 수행합니다.
- `npm run start`: 생성된 프로덕션 빌드를 로컬에서 실행합니다.
- `npm run lint`: Next.js ESLint 검사를 실행합니다.

`next.config.mjs`는 정적 배포를 위해 `output: 'export'`를 사용하며, 빌드 산출물은 `out/`에 생성됩니다. 정적 export에서는 Next rewrites가 동작하지 않으므로 `/api`, `/login` 같은 요청은 `NEXT_PUBLIC_API_BASE_URL`로 백엔드 운영 주소를 직접 사용하거나, 별도 Nginx/배포 플랫폼 프록시에서 처리합니다. 관련 배포 메모는 `docs/deployment-static-export.md`를 확인하세요.

## 코딩 스타일 및 네이밍 규칙

애플리케이션 코드는 TypeScript로 작성하고 `strict` 설정을 유지합니다. React 함수형 컴포넌트와 App Router 규칙을 따릅니다. 컴포넌트 파일은 `TypeCodeSelector.tsx`처럼 `PascalCase`를 사용하고, 라우트 폴더는 `login`, `signup`, `plan/add`처럼 URL에 맞춘 소문자 경로를 사용합니다. CSS module은 해당 라우트 옆에 `page.module.css` 이름으로 둡니다. 변경 사항을 제출하기 전 `npm run lint`를 실행하세요.

## 테스트 지침

현재 `package.json`에는 테스트 프레임워크나 테스트 스크립트가 정의되어 있지 않습니다. 테스트가 추가되기 전까지는 `npm run lint`, `npm run build`, `npm run dev`에서의 수동 확인으로 변경 사항을 검증합니다. 테스트를 도입할 경우 변경한 모듈 근처에 `ComponentName.test.tsx` 또는 `api-helper.test.ts`처럼 명확한 이름으로 배치하세요.

## 커밋 및 Pull Request 지침

커밋 제목은 짧고 명령형으로 작성합니다. 예: `Add plan creation form validation`, `Fix API error handling`. 하나의 커밋에는 하나의 논리적 변경만 담습니다. Pull Request에는 변경 요약, 실행한 검증 명령, 관련 이슈 링크, UI 변경 시 스크린샷이나 화면 녹화를 포함하세요.

## 보안 및 설정 팁

클라이언트에 노출되는 API 설정은 `NEXT_PUBLIC_API_BASE_URL`을 사용하고, 서버 측 호출에는 `INTERNAL_API_URL`을 사용할 수 있습니다. 정적 export 배포에서는 `NEXT_PUBLIC_API_BASE_URL`이 빌드 시점에 번들에 포함되므로 운영 백엔드 주소를 빌드 환경 변수로 주입해야 합니다. 정적 Nginx 배포에서는 `nginx.conf`의 `proxy_pass` 대상도 운영 백엔드 주소와 맞는지 확인하세요. 비밀 값이나 환경별 인증 정보는 커밋하지 마세요.

## 서브에이전트 운용

매 채팅에서 작업을 시작하기 전에 요청 성격과 관련된 `docs/subagents/` 문서를 먼저 확인합니다. 실제 서브에이전트 인스턴스는 런타임에 호출되지만, 역할과 검토 기준은 이 저장소의 문서를 기준으로 삼습니다.

- `docs/subagents/nextjs-expert.md`: 라우트, App Router, React/TypeScript 구조 변경
- `docs/subagents/api-integration-expert.md`: API 호출, 인증, 백엔드 응답 규약, rewrite
- `docs/subagents/ui-css-expert.md`: 화면 구성, CSS 영향 범위, 반응형 UI
- `docs/subagents/test-build-expert.md`: lint, build, 테스트, CI 검증
- `docs/subagents/deployment-expert.md`: 배포, 환경 변수, Nginx, 운영 연결

구현 전에는 관련 전문 문서의 리스크와 체크리스트를 반영하고, 구현 후에는 변경 파일 범위와 검증 명령을 기준으로 다시 확인합니다. 코드 수정 작업을 서브에이전트에 맡길 때는 파일 범위를 명확히 나누고, 다른 작업자의 변경을 되돌리지 않도록 지시합니다.
