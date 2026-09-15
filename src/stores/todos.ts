import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { ArchiveDay, Todo, TodoTag } from '@/types/todo'
import { tags } from '@/types/todo'
const STORAGE_KEY = 'taskflow-todos'
const DAY_IN_MS = 24 * 60 * 60 * 1000

function startOfDay(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate())
}

function todoDate(todo: Todo) {
  const date = new Date(todo.createdAt)
  return Number.isNaN(date.getTime()) ? null : startOfDay(date)
}

function isToday(todo: Todo) {
  const date = todoDate(todo)
  return date?.getTime() === startOfDay(new Date()).getTime()
}
export const useTodoStore = defineStore('todos', () => {
  const saved = localStorage.getItem(STORAGE_KEY)
  const todos = ref<Todo[]>(saved ? JSON.parse(saved) : [])
  const activeTag = ref<TodoTag | '전체'>('전체')
  const todayTodos = computed(() => todos.value.filter(isToday))
  const filteredTodos = computed(() =>
    activeTag.value === '전체'
      ? todayTodos.value
      : todayTodos.value.filter((todo) => todo.tag === activeTag.value),
  )
  const completedCount = computed(() => todayTodos.value.filter((todo) => todo.completed).length)
  const completionRate = computed(() =>
    todayTodos.value.length
      ? Math.round((completedCount.value / todayTodos.value.length) * 100)
      : 0,
  )
  const tagStats = computed(() =>
    tags.map((tag) => {
      const items = todayTodos.value.filter((todo) => todo.tag === tag)
      const completed = items.filter((todo) => todo.completed).length
      return {
        tag,
        total: items.length,
        completed,
        rate: items.length ? Math.round((completed / items.length) * 100) : 0,
      }
    }),
  )
  // 과거 기록 (7일)
  const archive = computed<ArchiveDay[]>(() => {
    const today = startOfDay(new Date())
    const oldestDate = new Date(today.getTime() - 7 * DAY_IN_MS)
    const grouped = new Map<number, Todo[]>()

    for (const todo of todos.value) {
      const date = todoDate(todo)
      if (!date || date >= today || date < oldestDate) continue
      const key = date.getTime()
      grouped.set(key, [...(grouped.get(key) ?? []), todo])
    }

    return (
      [...grouped.entries()]
        // 최신 날짜부터 정렬
        .sort(([a], [b]) => b - a)
        // 각 날짜별로 ArchiveDay 객체 생성
        .map(([timestamp, items]) => {
          const date = new Date(timestamp)
          const tagCounts: Partial<Record<TodoTag, number>> = {}
          for (const item of items) tagCounts[item.tag] = (tagCounts[item.tag] ?? 0) + 1

          return {
            timestamp,
            date: `${date.getMonth() + 1}월 ${date.getDate()}일`,
            day: new Intl.DateTimeFormat('ko-KR', { weekday: 'short' })
              .format(date)
              .replace('요일', ''),
            summary: items.map((item) => item.title).join(', '),
            completed: items.filter((item) => item.completed).length,
            total: items.length,
            tags: tagCounts,
          }
        })
    )
  })
  // 주간 전체 달성률 계산
  const weeklyCompletionRate = computed(() => {
    const total = archive.value.reduce((sum, day) => sum + day.total, 0)
    const completed = archive.value.reduce((sum, day) => sum + day.completed, 0)
    return total ? Math.round((completed / total) * 100) : 0
  })
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
    todos.value = todos.value.filter((item) => !item.completed || !isToday(item))
  }
  watch(todos, (value) => localStorage.setItem(STORAGE_KEY, JSON.stringify(value)), { deep: true })
  return {
    todos,
    todayTodos,
    activeTag,
    filteredTodos,
    completedCount,
    completionRate,
    tagStats,
    archive,
    weeklyCompletionRate,
    addTodo,
    toggleTodo,
    updateTodo,
    deleteTodo,
    clearCompleted,
  }
})
