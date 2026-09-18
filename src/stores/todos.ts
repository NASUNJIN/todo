import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { ArchiveDay, TagDefinition, Todo, TodoTag } from '@/types/todo'
import { defaultTags, fallbackTag } from '@/types/todo'
const STORAGE_KEY = 'doneit-todos'
const TAG_STORAGE_KEY = 'doneit-tags'
const DAY_IN_MS = 24 * 60 * 60 * 1000

function startOfDay(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate())
}

function todoDate(todo: Todo) {
  const value = todo.targetDate || todo.createdAt
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00`) : new Date(value)
  return Number.isNaN(date.getTime()) ? null : startOfDay(date)
}

function isToday(todo: Todo) {
  const date = todoDate(todo)
  return date?.getTime() === startOfDay(new Date()).getTime()
}
export const useTodoStore = defineStore('todos', () => {
  const saved = localStorage.getItem(STORAGE_KEY)
  const todos = ref<Todo[]>(saved ? JSON.parse(saved) : [])
  const savedTags = localStorage.getItem(TAG_STORAGE_KEY)
  const customTags = ref<TagDefinition[]>(savedTags ? JSON.parse(savedTags) : [])
  const tags = computed(() => [...defaultTags, ...customTags.value])
  const knownTagNames = new Set(tags.value.map((tag) => tag.name))
  todos.value = todos.value.map((todo) =>
    knownTagNames.has(todo.tag) ? todo : { ...todo, tag: fallbackTag },
  )
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos.value))
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
    tags.value.map((definition) => {
      const items = todayTodos.value.filter((todo) => todo.tag === definition.name)
      const completed = items.filter((todo) => todo.completed).length
      return {
        tag: definition.name,
        color: definition.color,
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
          const tagCounts: Record<TodoTag, number> = {}
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
    if (clean) {
      const now = new Date()
      todos.value.push({
        id: crypto.randomUUID(),
        title: clean,
        tag,
        completed: false,
        createdAt: now.toISOString(),
        targetDate: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`,
      })
    }
  }

  function addTag(name: string, color: string) {
    const clean = name.trim()
    if (
      !clean ||
      tags.value.some((tag) => tag.name.toLocaleLowerCase() === clean.toLocaleLowerCase())
    )
      return false
    customTags.value.push({ name: clean, color, isCustom: true })
    return true
  }

  function tagColor(name: TodoTag) {
    return tags.value.find((tag) => tag.name === name)?.color ?? '#64748b'
  }

  function deleteTag(name: TodoTag) {
    const index = customTags.value.findIndex((tag) => tag.name === name)
    if (index === -1) return false
    todos.value = todos.value.map((todo) =>
      todo.tag === name ? { ...todo, tag: fallbackTag } : todo,
    )
    customTags.value.splice(index, 1)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos.value))
    localStorage.setItem(TAG_STORAGE_KEY, JSON.stringify(customTags.value))
    if (activeTag.value === name) activeTag.value = fallbackTag
    return true
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
  watch(customTags, (value) => localStorage.setItem(TAG_STORAGE_KEY, JSON.stringify(value)), {
    deep: true,
  })
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
    tags,
    addTag,
    deleteTag,
    tagColor,
    addTodo,
    toggleTodo,
    updateTodo,
    deleteTodo,
    clearCompleted,
  }
})
