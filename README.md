# ✓ Done It

> 오늘의 할 일을 기록하고, 태그별 진행 현황과 최근 기록을 한 화면에서 확인하는 To-do 대시보드입니다.

![Vue](https://img.shields.io/badge/Vue-3-42b883?logo=vuedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Nginx-2496ed?logo=docker&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 주요 기능

- 할 일 추가, 수정, 완료 처리, 삭제 및 완료 항목 숨기기
- `일`, `공부`, `운동`, `개인`, `기타` 태그 필터와 사용자 정의 태그·색상 추가
- 오늘의 완료율 및 태그별 진행률을 즉시 갱신하는 통계 패널
- 최근 7일간의 기록을 어제·이번 주·지난주로 나누어 보여주는 아카이브
- 라이트/다크 모드 전환
- 브라우저 Local Storage를 사용한 할 일, 태그, 테마 설정 자동 저장

## 기술 스택

| 구분      | 기술                                     |
| --------- | ---------------------------------------- |
| Framework | Vue 3, Composition API, `<script setup>` |
| Language  | TypeScript                               |
| Build     | Vite                                     |
| State     | Pinia                                    |
| Styling   | Tailwind CSS                             |
| UI        | `@kalimahapps/vue-icons`, `vue3-lottie`  |
| Deploy    | Docker, Nginx                            |

## 시작하기

### 요구 사항

- Node.js `22.18.0` 이상 또는 `24.12.0` 이상
- npm

### 설치 및 실행

```bash
npm install
npm run dev
```

명령 실행 후 터미널에 표시되는 로컬 주소(기본값: `http://localhost:5173`)를 브라우저에서 엽니다.

## Docker로 실행하기

Docker가 설치되어 있다면 별도의 로컬 Node.js 설정 없이 프로덕션 빌드를 실행할 수 있습니다.

```bash
# 이미지 빌드
docker build -t done-it .

# 컨테이너 실행
docker run --rm -p 8080:80 --name done-it done-it
```

브라우저에서 `http://localhost:8080`을 열어 확인합니다. 실행 중인 컨테이너를 직접 중지하려면 다음 명령을 사용합니다.

```bash
docker stop done-it
```

Docker 이미지는 다단계 빌드를 사용합니다. 첫 번째 단계에서 Vue 애플리케이션을 빌드하고, 두 번째 단계에서 생성된 `dist` 파일을 Nginx로 제공합니다. `nginx.conf`의 `try_files` 설정을 통해 브라우저에서 경로를 직접 열거나 새로고침해도 Vue Router가 정상적으로 동작합니다.

### 사용 가능한 명령어

| 명령어               | 설명                                     |
| -------------------- | ---------------------------------------- |
| `npm run dev`        | 개발 서버 실행                           |
| `npm run build`      | 타입 검사 후 프로덕션 빌드 생성          |
| `npm run preview`    | 빌드 결과 미리 보기                      |
| `npm run type-check` | TypeScript 타입 검사                     |
| `npm run lint`       | ESLint와 Oxlint로 코드 검사 및 자동 수정 |
| `npm run format`     | Prettier로 `src` 코드 포맷팅             |

## 사용 방법

1. **새로운 할 일 추가**를 눌러 할 일과 태그를 입력합니다.
2. 목록의 체크 버튼으로 완료 상태를 바꾸고, 필요하면 항목을 수정하거나 삭제합니다.
3. 상단 태그를 선택해 목록을 필터링합니다. **태그 추가**에서 이름과 색상을 지정할 수 있습니다.
4. 오른쪽 패널에서 오늘의 달성률, 태그별 진행률, 최근 7일 기록을 확인합니다.
5. 헤더의 테마 버튼으로 라이트/다크 모드를 전환합니다.

## 프로젝트 구조

```text
.
├── src/
│   ├── components/ # 할 일 목록, 통계, 아카이브 등 UI 컴포넌트
│   ├── stores/     # Pinia 상태 및 Local Storage 동기화
│   ├── types/      # Todo·태그 타입과 기본값
│   ├── views/      # 페이지 단위 컴포넌트
│   ├── router/     # Vue Router 설정
│   └── assets/     # 전역 스타일 및 애니메이션 리소스
├── Dockerfile      # 애플리케이션 빌드 및 Nginx 배포 이미지 설정
└── nginx.conf      # 정적 파일 제공 및 SPA 라우팅 설정
```

## 데이터 저장

별도 백엔드 없이 브라우저의 Local Storage에 데이터를 저장합니다. 아래 키를 삭제하면 해당 데이터가 초기화됩니다.

| 키             | 저장 내용        |
| -------------- | ---------------- |
| `doneit-todos` | 할 일 목록       |
| `doneit-tags`  | 사용자 정의 태그 |
| `doneit-theme` | 선택한 테마      |

브라우저 개발자 도구의 **Application → Local Storage**에서 키를 삭제한 뒤 새로고침하세요.

## 라이선스

프로젝트 소스 코드는 [MIT License](LICENSE)로 배포됩니다.

Lordicon 애니메이션과 아이콘 세트 등 제3자 자산은 각각의 라이선스를 따릅니다.
상세한 자산 출처와 라이선스는 [NOTICE.md](NOTICE.md)에서 확인할 수 있습니다.
