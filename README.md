# AIROAD (알로드) 프론트엔드

안양시 도로 파손을 시민이 신고하고, AI 분석 결과를 바탕으로 관리자가 신고를 처리하고 점검 우선순위를 관리하는 웹 서비스의 프론트엔드입니다.

## 주요 기능

### 시민
- **지도**: 카카오맵에서 도로 파손 신고 위치와 처리 상태를 확인하고, 상태·유형으로 필터링
- **파손 신고**: 사진, 위치, 파손 유형(종방향 균열 / 횡방향 균열 / 거북등 균열 / 포트홀), 위험도를 입력해 신고
- **내 신고현황**: 내가 접수한 신고의 처리 단계(접수됨 / 처리중 / 처리완료 / 반려)와 AI 분석 결과 확인
- **내 문의**: 문의 접수, 내 문의 목록 조회, 담당자 답변 확인, 답변 대기 중인 문의의 수정·삭제

### 관리자
- **대시보드**: 지도와 통계 카드, 오늘의 우선 점검 구간
- **신고 관리**: 신고 목록·상세(AI 검수), 처리 상태 진행, 반려, 미분류 신고 확인
- **점검 우선순위**: 구간별 점검 우선순위와 등급별 요약, 도로 상세(월별 파손 이력)
- **회원 관리**: 회원 목록 조회, 이용 제한 / 해제
- **문의 관리**: 시민 문의 조회, 답변 등록, 삭제

## 기술 스택

| 구분 | 사용 기술 |
|---|---|
| 프레임워크 | React 19, Vite 8 |
| 라우팅 | React Router 7 |
| 스타일 | Tailwind CSS 4 (`@tailwindcss/vite`) |
| 지도 | Kakao Maps (`react-kakao-maps-sdk`) |
| 아이콘 | lucide-react |
| 린트 | ESLint 10 (react-hooks, react-refresh) |

## 시작하기

> 프로젝트가 `anyang_frontend/` 폴더 안에 있어서, 아래 명령과 `.env`, `src/` 경로는 모두 이 폴더 기준입니다. (`cd anyang_frontend` 후 진행)

### 1. 설치
```bash
npm install
```

### 2. 환경변수 설정
프로젝트 루트(`package.json`이 있는 위치)에 `.env` 파일을 만들고 아래 값을 채웁니다. `.env`는 `.gitignore`에 포함돼 있어 커밋되지 않습니다.

```bash
VITE_API_BASE_URL=http://localhost:8085
VITE_KAKAO_MAP_KEY=발급받은_카카오_JavaScript_키
VITE_GOOGLE_OAUTH_URL=구글_로그인_시작_URL
VITE_NAVER_OAUTH_URL=네이버_로그인_시작_URL
```

| 변수 | 설명 |
|---|---|
| `VITE_API_BASE_URL` | 백엔드 주소. **없으면 `http://localhost:8085`로 폴백**하므로 배포 시 반드시 설정 |
| `VITE_KAKAO_MAP_KEY` | 카카오맵 JavaScript 앱 키. 지도와 주소 검색에 사용 |
| `VITE_GOOGLE_OAUTH_URL` | 구글 소셜 로그인 시작 URL |
| `VITE_NAVER_OAUTH_URL` | 네이버 소셜 로그인 시작 URL |

Vite는 빌드 시점에 환경변수를 코드에 넣기 때문에, 값을 바꾸면 개발 서버를 다시 시작하거나 다시 빌드해야 합니다.

### 3. 실행
```bash
npm run dev       # 개발 서버 (HMR)
npm run build     # 프로덕션 빌드 (dist/)
npm run preview   # 빌드 결과 미리보기
npm run lint      # ESLint 검사
```

## 화면 경로

| 경로 | 화면 | 접근 |
|---|---|---|
| `/login`, `/signup` | 로그인, 회원가입 | 공개 |
| `/oauth/callback` | 소셜 로그인 콜백 | 공개 |
| `/` | 지도 | 로그인 (관리자는 `/admin`으로 이동) |
| `/report` | 파손 신고 | 로그인 |
| `/my-reports` | 내 신고현황 | 로그인 |
| `/inquiry` | 내 문의 목록 | 로그인 |
| `/inquiry/new` | 문의 접수 | 로그인 |
| `/admin` | 관리자 대시보드 | 관리자 |
| `/admin/reports`, `/admin/reports/:id` | 신고 관리, 신고 상세 | 관리자 |
| `/admin/priority` | 점검 우선순위 | 관리자 |
| `/admin/roads/:id` | 도로 상세 | 관리자 |
| `/admin/members` | 회원 관리 | 관리자 |
| `/admin/inquiries` | 문의 관리 | 관리자 |

## 인증과 권한
- 로그인하면 백엔드가 JWT를 내려주고, 이후 모든 API 요청에 `Authorization: Bearer <token>`이 자동으로 붙습니다 (`src/api/client.js`).
- 토큰은 로그인 유지 여부에 따라 `localStorage` 또는 `sessionStorage`에 저장합니다.
- 토큰의 `role` 값(`CITIZEN` / `ADMIN`)으로 화면 접근을 제한합니다. 시민 페이지는 `RequireAuth`, 관리자 페이지는 `RequireAdmin`이 막고, 로그인 후에는 원래 가려던 페이지로 돌아갑니다.
- 서버가 401로 토큰을 거부하면 세션 만료로 처리해 로그아웃하고 안내 모달을 띄웁니다. 403은 권한 제한이라 세션 만료로 보지 않습니다.

## 백엔드 API

| 컨트롤러 | 프론트 모듈 |
|---|---|
| auth | `src/api/auth.js` |
| report | `src/api/report.js` |
| user | `src/api/admin.js` |
| inspection-cluster | `src/api/inspectionClusters.js` |
| inquiry | `src/api/inquiry.js` |

- 백엔드 enum(대문자)과 화면 표기(소문자 키) 사이의 변환은 `src/api/enumMapping.js`에 모여 있습니다.
- 신고 상세 조회 API가 없어서 관리자 신고 상세는 전체 목록에서 id로 찾아 사용합니다.

## 폴더 구조
```
src/
├─ api/          백엔드 호출과 응답 변환 (client.js가 공통 fetch 래퍼)
├─ components/
│  ├─ admin/     관리자 화면 컴포넌트
│  ├─ auth/      로그인·회원가입·라우트 가드
│  ├─ citizen/   시민 화면 컴포넌트
│  └─ common/    공용 모달 등 (Modal, ConfirmModal, MessageModal)
├─ context/      인증 상태 (AuthContext)
├─ hooks/        화면별 커스텀 훅 (admin / auth / citizen), useListQuery 등
├─ mocks/        화면 표기용 상수 (라벨, 아이콘, 색상 등)
├─ pages/        라우트 단위 페이지 (admin / auth / citizen)
└─ utils/        JWT 해석, 토큰 저장, 숫자·전화번호 포맷 등
```

## 협업 규칙

### 브랜치
`feature/*`, `fix/*`, `refactor/*` 브랜치에서 작업한 뒤 `develop`으로 PR을 올려 머지하고, 안정화된 `develop`을 `main`에 PR로 반영합니다.

### 커밋 메시지
`타입: 한글 설명` 형식을 씁니다.

| 타입 | 용도 |
|---|---|
| `feat` | 새 기능 |
| `fix` | 버그 수정 |
| `refactor` | 동작 변경 없는 구조 개선 |
| `style` | UI·스타일 변경 |
| `perf` | 성능 개선 |
| `docs` | 문서·주석 |
| `chore` | 빌드·설정 등 기타 |

예) `fix: 문의 수정 후 재조회만 실패해도 전체 실패로 표시되던 문제`
