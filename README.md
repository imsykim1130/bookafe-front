# Bookafe

## 프로젝트 소개

`React` 기반의 책에 대한 의견을 나눌 수 있는 게시판

## 개발기간

2024.10 ~ 2024.02

## 개발환경

- 언어: `Typescript`
- 프레임워크: `React 18.2.0`
- 빌더: `Vite`
- 라우팅: `React Router`
- HTTP: `Axios`
- 클라이언트 상태 관리: `zustand`
- 서버 상태 관리: `Tanstack Query`
- 스타일링: `tailwind CSS`
- 코드 포맷팅: `ESLint`, `Prettier`
- 패키지 매니저: `npm`
- 운영 플랫폼: `docker` + `docker compose`
- 배포: Nginx(Reverse Proxy) + React
- 문서화: `Notion`
- CI: `Github Actions`

## 주요 기능

- 반응형 디자인(모바일 위주)

- shadcn 디자인 시스템: 디자인 통일을 위해 shadcn 을 활용

- 닉네임 추천받기: openai 의 Chat Completions API 를 이용하여 랜덤 한글 닉네임을 추천
- 관리자용 페이지 별도 구성: 유저 관리, 추천 책 관리
- 책 검색결과 무한 스크롤: 사용자의 이탈을 줄이고 컨텐츠를 둘러볼 수 있도록 함
- 서버 데이터 캐싱: Tanstack Query 의 캐싱 기능을 사용하여 동일한 데이터에 대한 불필요한 요청을 줄여 서버에 대한 부하를 줄임

## 프로젝트 구조

- `api`: API 요청, 응답 관련 타입, 메서드
- `components`: 재사용 가능한 컴포넌트
- `hook`: 비즈니스 로직을 구현한 커스텀 훅
- `layout`: 공통 레이아웃 컴포넌트
- `pages`: 페이지 컴포넌트
- `store`: 클라이언트 전역 상태
- `types`: 전역적으로 사용되는 데이터의 타입
- `utils`: 전역적으로 사용되는 유틸 메서드

## 미리보기

- 추가 예정
