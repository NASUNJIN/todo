# TaskFlow

Vue 3의 Composition API와 `<script setup>`, Pinia, Vue Router, Tailwind CSS를 학습하며 만든 3단 ToDo 대시보드입니다.

## 실행하기

```sh
npm install
npm run dev
```

프로덕션 빌드와 타입 검사는 `npm run build`로 함께 실행합니다.

## 처음 공부할 때 읽을 코드 순서

1. `src/types/todo.ts` — 데이터 한 건의 모양(`Todo`)과 태그 타입을 확인합니다.
2. `src/stores/todos.ts` — 상태, 계산된 값, CRUD 함수, localStorage 저장 흐름을 읽습니다.
3. `src/views/HomeView.vue` — 페이지가 세 영역을 어떻게 조립하는지 확인합니다.
4. `src/components/TodoWorkspace.vue` — `ref`, `storeToRefs`, 이벤트, 폼 바인딩을 익힙니다.
5. `src/components/TodoItem.vue` — props와 수정/삭제/완료 이벤트 흐름을 봅니다.
6. `src/components/StatsPanel.vue` — 계산 결과가 그래프로 바로 반영되는 방식을 봅니다.
7. `src/stores/theme.ts` — 다크 모드 상태와 localStorage 동기화를 확인합니다.
8. `src/assets/main.css` — Tailwind 진입점, 전역 폰트, 다크 모드 variant를 확인합니다.

## 기능을 따라 만들어 보는 추천 순서

완성 코드를 한 번에 외우기보다 아래 순서로 작은 브랜치나 복사본에서 다시 만들어 보세요.

1. 배열을 화면에 `v-for`로 출력합니다.
2. 체크 버튼에 `@click`을 연결해 `completed`를 바꿉니다.
3. 입력 폼과 `v-model`로 새 할 일을 추가합니다.
4. 수정과 삭제 함수를 추가해 CRUD를 완성합니다.
5. `computed`로 완료 개수와 달성률을 계산합니다.
6. 태그 필터를 구현합니다.
7. 상태를 컴포넌트 밖의 Pinia 스토어로 옮깁니다.
8. `watch`로 localStorage에 저장합니다.
9. Tailwind의 `dark:` 클래스로 두 테마를 만듭니다.
10. 마지막으로 반응형 그리드와 그래프를 붙입니다.

## 핵심 Vue 문법

- `ref`: 입력값이나 선택된 필터처럼 바뀌는 값
- `computed`: 할 일 배열에서 자동으로 계산되는 달성률과 통계
- `v-model`: 입력 요소와 Vue 상태의 양방향 연결
- `v-for`: 배열을 반복해 목록 렌더링
- `v-if`: 입력 폼, 빈 상태, 편집 모드 조건부 표시
- `defineProps`: 부모가 `TodoItem`에 할 일 한 건을 전달
- Pinia action: 여러 컴포넌트가 같은 추가·수정·삭제 로직을 사용

브라우저 개발자 도구의 Application → Local Storage에서 `taskflow-todos`와 `taskflow-theme` 값을 지우면 초기 상태로 되돌릴 수 있습니다.
