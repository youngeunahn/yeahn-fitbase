# GEMINI.md

이 파일은 `FitBase` 프로젝트에 대한 핵심 안내와 개발 가이드를 제공합니다. 이 프로젝트는 운동 템플릿을 조회하고 관리할 수 있는 사용자 전용 웹 인터페이스로, 기존 Vite 기반에서 Next.js(App Router) 환경으로 마이그레이션되었습니다.

## 프로젝트 개요

- **목적**: 사용자가 운동 템플릿을 조회하고 관리할 수 있는 React 기반 웹 어플리케이션.
- **주요 기술 스택**: 
  - **Framework**: Next.js 15.1 (App Router)
  - **Language**: JavaScript (ES Modules)
  - **Styling**: Vanilla CSS (`App.css`, `index.css`)
  - **API 통신**: 
    - **Server-side**: 서버 컴포넌트에서 직접 백엔드 API 호출 (SSR)
    - **Client-side**: 브라우저 내장 `fetch` API를 사용한 클라이언트 사이드 호출
- **백엔드 연동**: Spring Boot 기반 API 서버와 연동되며, 로컬 개발 시 `next.config.mjs`의 `rewrites` 기능을 통해 `/api` 요청을 백엔드(`:8080`)로 전달합니다.

## 실행 및 빌드 커맨드

| 커맨드 | 설명 |
| :--- | :--- |
| `npm install` | 프로젝트 의존성 설치 |
| `npm run dev` | 로컬 개발 서버 실행 (기본: http://localhost:3000) |
| `npm run build` | 운영 환경용 프로덕션 빌드 |
| `npm run start` | 빌드된 프로덕션 서버 실행 |
| `npm run lint` | Next.js 내장 린터를 이용한 코드 스타일 및 오류 검사 |

## 아키텍처 및 폴더 구조

- `src/app/`: Next.js App Router 기반의 페이지 및 레이아웃 정의.
  - `layout.js`: 앱의 전체 레이아웃 및 글로벌 CSS 임포트.
  - `page.js`: 메인 페이지. 서버 컴포넌트로 구현되어 데이터를 서버에서 직접 페칭합니다.
- `src/components/`: 재사용 가능한 UI 컴포넌트.
  - `TypeCodeSelector.js`: 운동 타입을 선택하는 클라이언트 컴포넌트 (`'use client'`).
- `src/api/`: API 통신 모듈.
  - `client.js`: 서버/클라이언트 환경을 모두 지원하는 공통 `fetch` 래퍼.
  - `templates.js`: 운동 템플릿 관련 API 호출 함수 정의.
- `src/assets/`: 이미지, 아이콘 등 정적 자원 모음.

## 개발 컨벤션 및 팁

### 1. 데이터 페칭 전략 (SSR & RSC)
- **서버 컴포넌트 우선**: 데이터 페칭은 가급적 `src/app/page.js`와 같은 서버 컴포넌트에서 수행하여 초기 로딩 성능을 최적화하고 클라이언트 자바스크립트 번들 크기를 줄입니다.
- **URL 상태 관리**: 검색 필터나 타입 선택(e.g., `typeCode`)은 URL 쿼리 파라미터를 통해 관리합니다. 클라이언트에서 URL을 변경하면 서버 컴포넌트가 이를 감지하여 새로운 데이터를 서버에서 다시 불러옵니다.

### 2. API 통신 및 환경 변수
- **환경 변수**:
  - `INTERNAL_API_URL`: 서버 사이드에서 백엔드 서버에 직접 접근할 때 사용 (기본: `http://localhost:8080`).
  - `NEXT_PUBLIC_API_BASE_URL`: 클라이언트 사이드에서 API 접근 시 사용 (기본적으로 비워두어 프록시 활용).
- **프록시**: `next.config.mjs`에 정의된 `rewrites`를 통해 클라이언트 사이드에서의 `/api` 요청이 백엔드로 자동 전달됩니다.

### 3. 스타일링 및 UI 가이드
- 기존에 정의된 CSS 클래스(`app-shell`, `topbar`, `content-panel` 등)를 최대한 유지합니다.
- 사용자가 명시적으로 요청하지 않는 한, 기존 UI 라벨이나 디자인 스타일은 변경하지 않습니다.

## 주요 API 엔드포인트

- `GET /api/user/templates`: 운동 템플릿 목록 조회 (Query Param: `typeCode`)
- `GET /api/user/templates/{tplSeq}`: 특정 템플릿 상세 정보 조회