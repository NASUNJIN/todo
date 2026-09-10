import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { ArchiveDay, Todo, TodoTag } from '@/types/todo'
import { tags } from '@/types/todo'
const STORAGE_KEY = 'taskflow-todos'
const starterTodos: Todo[] = [
  {
    id: '1',
    title: '국어 문제 풀이 (수능특강 3회)',
    tag: '공부',
    completed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: '국어 비문학 구조 분석 및 요약',
    tag: '공부',
    completed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: '주간 업무 보고서 작성 및 공유',
    tag: '일',
    completed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: '문학 교재 현대시 단원 풀기',
    tag: '공부',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: '저녁 러닝 머신 5km 러닝',
    tag: '운동',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    title: '단어 복습 정리 및 노트 필기',
    tag: '개인',
    completed: false,
    createdAt: new Date().toISOString(),
  },
]
export const archive: ArchiveDay[] = [
  {
    date: '10월 23일',
    day: '월',
    summary: '국어 수능완성 실전편, 알고리즘 문제 풀이, 영어 에세이',
    completed: 5,
    total: 5,
    tags: { 공부: 3, 일: 1, 운동: 1 },
  },
  {
    date: '10월 20일',
    day: '금',
    summary: '팀 스프린트 회고, 코어 운동 루틴 30분 진행',
    completed: 4,
    total: 6,
    tags: { 일: 2, 운동: 2 },
  },
  {
    date: '10월 19일',
    day: '목',
    summary: '문학 고전시가 핵심정리, 프로젝트 배포 완료',
    completed: 6,
    total: 6,
    tags: { 공부: 4, 개인: 2 },
  },
  {
    date: '10월 18일',
    day: '수',
    summary: '야외 러닝 6km, 주간 계획표 정리 및 리셋',
    completed: 3,
    total: 5,
    tags: {},
  },
]
export const useTodoStore = defineStore('todos', () => {
  const saved = localStorage.getItem(STORAGE_KEY)
  const todos = ref<Todo[]>(saved ? JSON.parse(saved) : starterTodos)
  const activeTag = ref<TodoTag | '전체'>('전체')
  const filteredTodos = computed(() =>
    activeTag.value === '전체'
      ? todos.value
      : todos.value.filter((todo) => todo.tag === activeTag.value),
  )
  const completedCount = computed(() => todos.value.filter((todo) => todo.completed).length)
  const completionRate = computed(() =>
    todos.value.length ? Math.round((completedCount.value / todos.value.length) * 100) : 0,
  )
  const tagStats = computed(() =>
    tags.map((tag) => {
      const items = todos.value.filter((todo) => todo.tag === tag)
      const completed = items.filter((todo) => todo.completed).length
      return {
        tag,
        total: items.length,
        completed,
        rate: items.length ? Math.round((completed / items.length) * 100) : 0,
      }
    }),
  )
  function addTodo(title: string, tag: TodoTag) {
    const clean = title.trim()
    if (clean)
      todos.value.push({
        id: crypto.randomUUID(),
        title: clean,
        tag,
        completed: false,
        createdAt: new Date().toISOString(),
      })
  }
  function toggleTodo(id: string) {
    const todo = todos.value.find((item) => item.id === id)
    if (todo) todo.completed = !todo.completed
  }
  function updateTodo(id: string, title: string, tag: TodoTag) {
    const todo = todos.value.find((item) => item.id === id)
    if (todo && title.trim()) Object.assign(todo, { title: title.trim(), tag })
  }
  function deleteTodo(id: string) {
    todos.value = todos.value.filter((item) => item.id !== id)
  }
  function clearCompleted() {
    todos.value = todos.value.filter((item) => !item.completed)
  }
  watch(todos, (value) => localStorage.setItem(STORAGE_KEY, JSON.stringify(value)), { deep: true })
  return {
    todos,
    activeTag,
    filteredTodos,
    completedCount,
    completionRate,
    tagStats,
    addTodo,
    toggleTodo,
    updateTodo,
    deleteTodo,
    clearCompleted,
  }
})
