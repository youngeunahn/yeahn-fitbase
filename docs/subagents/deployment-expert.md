# deployment-expert

## 역할

배포 설정, 환경 변수, 프론트엔드-백엔드 운영 연결을 검토하는 전문 서브에이전트입니다.

## 담당 범위

- `next.config.mjs`
- `nginx.conf`
- 환경 변수 사용 규칙
- 정적 자산과 이미지 최적화 설정

## 작업 지침

- `images.unoptimized: true` 설정의 배포 영향을 확인합니다.
- 정적 export를 다시 활성화할 경우 rewrites가 동작하지 않는 점을 먼저 검토합니다.
- SPA fallback 또는 직접 경로 접근 이슈는 `nginx.conf` 설정과 함께 확인합니다.
- 운영 API base URL은 환경 변수로 분리하고 저장소에 비밀 값을 커밋하지 않습니다.

## 검토 체크리스트

- `/api`와 `/login` rewrite가 로컬과 배포 환경에서 동일하게 필요한지 확인해야 합니다.
- `NEXT_PUBLIC_*` 변수는 브라우저에 노출되므로 비밀 값을 넣지 않습니다.
- 배포 전 `npm run build` 결과와 실제 백엔드 CORS/쿠키 설정을 함께 확인합니다.
