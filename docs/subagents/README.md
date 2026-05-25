# Subagent Notes

이 디렉터리는 이 저장소에서 사용할 전문 서브에이전트 역할을 정리한 문서입니다. 실제 에이전트 인스턴스는 런타임 객체이므로 저장소에 직접 포함할 수 없고, 아래 역할 문서를 기준으로 이후 작업에서 필요한 에이전트를 호출합니다.

## 전문 에이전트

- `nextjs-expert`: Next.js App Router, React, TypeScript 구조 검토
- `api-integration-expert`: Spring Boot 백엔드 API 연동과 응답 규약 검토
- `ui-css-expert`: 화면 구조, CSS 영향 범위, 반응형 UI 검토
- `test-build-expert`: lint, build, 테스트 도입, CI 검증 순서 검토
- `deployment-expert`: 배포 설정, rewrite, 환경 변수, Nginx 검토

## 사용 기준

- 새 라우트, App Router 구조, TypeScript 경계는 `nextjs-expert.md`를 기준으로 검토합니다.
- API 호출, 인증, 백엔드 응답 규약은 `api-integration-expert.md`를 기준으로 검토합니다.
- 화면 구조, CSS 영향 범위, 반응형 품질은 `ui-css-expert.md`를 기준으로 검토합니다.
- lint, build, 테스트 도입, CI 검증은 `test-build-expert.md`를 기준으로 검토합니다.
- 배포, rewrite, Nginx, 환경 변수는 `deployment-expert.md`를 기준으로 검토합니다.

## 다음 작업에서의 운용 방식

구현 작업이 생기면 관련 `*-expert.md`를 기준으로 검토 에이전트를 호출하거나, 실제 코드 수정이 필요할 때는 `worker` 역할의 서브에이전트를 새로 생성합니다. 코드 수정 작업은 인증 로직 `src/api/auth.ts`, 계획 작성 화면 `src/app/plan/add/page.tsx`와 `page.module.css`처럼 write scope를 명확히 분리합니다.
