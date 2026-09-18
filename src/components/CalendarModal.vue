<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { ko } from 'date-fns/locale'
import { ChChevronLeft, ChChevronRight, AkCross, FlEmojiSad } from '@kalimahapps/vue-icons'
import { useTodoStore } from '@/stores/todos'
import type { Todo, TodoTag } from '@/types/todo'

const emit = defineEmits<{ close: [] }>()
const store = useTodoStore()
const { todos, tags } = storeToRefs(store)
const modalRef = ref<HTMLElement | null>(null)
const closeButtonRef = ref<HTMLButtonElement | null>(null)

const initialDate = new Date()
const visibleMonth = ref(startOfMonth(initialDate))
const selectedDate = ref(initialDate)
const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

const calendarDays = computed(() => {
  const monthStart = startOfMonth(visibleMonth.value)
  const monthEnd = endOfMonth(visibleMonth.value)
  return eachDayOfInterval({
    start: startOfWeek(monthStart, { weekStartsOn: 0 }),
    end: endOfWeek(monthEnd, { weekStartsOn: 0 }),
  })
})

const selectedTodos = computed(() => todosForDate(selectedDate.value))
const selectedCompleted = computed(
  () => selectedTodos.value.filter((todo) => todo.completed).length,
)
const selectedRate = computed(() =>
  selectedTodos.value.length
    ? Math.round((selectedCompleted.value / selectedTodos.value.length) * 100)
    : 0,
)

const todosByDate = computed(() => {
  const grouped = new Map<string, Todo[]>()

  for (const todo of todos.value) {
    const key = todoDateKey(todo)
    if (!key) continue
    const items = grouped.get(key) ?? []
    items.push(todo)
    grouped.set(key, items)
  }

  return grouped
})

function dateKey(date: Date) {
  return format(date, 'yyyy-MM-dd')
}

function todoDateKey(todo: Todo) {
  const value = todo.targetDate || todo.createdAt
  if (!value) return null
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : dateKey(date)
}

function todosForDate(date: Date) {
  const key = dateKey(date)
  return todosByDate.value.get(key) ?? []
}

function dayRate(date: Date) {
  const todos = todosForDate(date)
  return todos.length
    ? Math.round((todos.filter((todo) => todo.completed).length / todos.length) * 100)
    : null
}

function tagSummary(date: Date) {
  const groups = new Map<TodoTag, { total: number; completed: number }>()
  for (const todo of todosForDate(date)) {
    const current = groups.get(todo.tag) ?? { total: 0, completed: 0 }
    current.total += 1
    if (todo.completed) current.completed += 1
    groups.set(todo.tag, current)
  }
  return [...groups.entries()].map(([tag, counts]) => ({ tag, ...counts }))
}

function tagColor(tag: TodoTag) {
  return store.tagColor(tag)
}

function selectDate(date: Date) {
  selectedDate.value = date
  if (!isSameMonth(date, visibleMonth.value)) visibleMonth.value = startOfMonth(date)
}

function goToToday() {
  const today = new Date()
  visibleMonth.value = startOfMonth(today)
  selectedDate.value = today
}

function moveMonth(offset: number) {
  const nextMonth = addMonths(visibleMonth.value, offset)

  visibleMonth.value = startOfMonth(nextMonth)
  selectedDate.value = startOfMonth(nextMonth) // 선택된 날짜도 해당 달의 1일로 이동
}

let previousBodyOverflow = ''
let previouslyFocusedElement: HTMLElement | null = null

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    emit('close')
    return
  }

  if (event.key !== 'Tab' || !modalRef.value) return
  const focusable = [...modalRef.value.querySelectorAll<HTMLElement>('button, input')].filter(
    (element) => !element.hasAttribute('disabled'),
  )
  if (!focusable.length) return

  const first = focusable[0]!
  const last = focusable.at(-1)!
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

onMounted(() => {
  previouslyFocusedElement = document.activeElement as HTMLElement | null
  previousBodyOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  window.addEventListener('keydown', handleKeydown)
  nextTick(() => closeButtonRef.value?.focus())
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = previousBodyOverflow
  previouslyFocusedElement?.focus()
})
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-3 backdrop-blur-[2px] dark:bg-slate-950/75 sm:p-6"
      role="presentation"
      @mousedown.self="emit('close')"
    >
      <section
        ref="modalRef"
        class="flex max-h-[94vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="calendar-modal-title"
      >
        <header
          class="flex items-center gap-3 border-b border-slate-200 px-5 py-3 dark:border-slate-700 sm:px-6"
        >
          <div class="min-w-0 flex-1">
            <h2 id="calendar-modal-title" class="font-bold">과거 기록 캘린더 조회</h2>
            <p class="mt-0.5 hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
              날짜별 달성 현황 및 그날의 기록 조회
            </p>
          </div>
          <div
            class="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300 md:flex"
          >
            <span class="font-semibold">태그 종류 :</span>
            <span v-for="tag in tags" :key="tag.name" class="inline-flex items-center gap-1">
              <i class="size-2 rounded-full" :style="{ backgroundColor: tag.color }" />{{
                tag.name
              }}
            </span>
          </div>
          <button
            ref="closeButtonRef"
            type="button"
            class="grid size-9 shrink-0 place-items-center rounded-xl"
            aria-label="캘린더 닫기"
            @click="emit('close')"
          >
            <AkCross />
          </button>
        </header>

        <div class="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[13fr_7fr] lg:overflow-hidden">
          <!-- 달력 -->
          <div
            class="border-b border-slate-200 dark:border-slate-700 sm:p-6 lg:overflow-y-auto lg:border-r lg:border-b-0"
          >
            <div class="mb-5 flex items-center justify-between gap-3">
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="grid size-8 place-items-center"
                  aria-label="이전 달"
                  @click="moveMonth(-1)"
                >
                  <ChChevronLeft />
                </button>
                <h3 class="min-w-28 text-center text-lg font-bold">
                  {{ format(visibleMonth, 'yyyy년 M월') }}
                </h3>
                <button
                  type="button"
                  class="grid size-8 place-items-center"
                  aria-label="다음 달"
                  @click="moveMonth(1)"
                >
                  <ChChevronRight />
                </button>
              </div>
              <button
                type="button"
                class="px-2 py-1 tracking-wide text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                @click="goToToday"
              >
                <strong class="text-xs">TODAY</strong>
              </button>
            </div>

            <div
              class="grid grid-cols-7 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/70"
            >
              <div
                v-for="(weekday, index) in weekdays"
                :key="weekday"
                class="py-2 text-center text-[11px] font-bold"
                :class="
                  index === 0
                    ? 'text-rose-500 dark:text-rose-400'
                    : index === 6
                      ? 'text-blue-500 dark:text-blue-400'
                      : 'text-slate-500 dark:text-slate-400'
                "
              >
                {{ weekday }}
              </div>
            </div>
            <div class="mt-2 grid grid-cols-7 gap-1.5 sm:gap-2">
              <button
                v-for="day in calendarDays"
                :key="dateKey(day)"
                type="button"
                class="flex flex-col justify-between w-full aspect-square min-w-0 rounded-xl border p-1.5 text-left transition focus-visible:outline-2 focus-visible:outline-blue-400 sm:p-2"
                :class="[
                  isSameDay(day, selectedDate)
                    ? 'border-blue-500 bg-blue-500/10 ring-1 ring-blue-500'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/45 dark:hover:border-slate-600 dark:hover:bg-slate-800',
                  !isSameMonth(day, visibleMonth) && 'opacity-30',
                ]"
                :aria-label="format(day, 'yyyy년 M월 d일')"
                :aria-pressed="isSameDay(day, selectedDate)"
                @click="selectDate(day)"
              >
                <!-- 상단 영역 : 날짜, 퍼센트 -->
                <span class="flex w-full items-start justify-between gap-1">
                  <b
                    class="text-xs sm:text-sm"
                    :class="
                      day.getDay() === 0
                        ? 'text-rose-500 dark:text-rose-400'
                        : day.getDay() === 6
                          ? 'text-blue-500 dark:text-blue-400'
                          : 'text-slate-700 dark:text-slate-200'
                    "
                    >{{ format(day, 'd') }}</b
                  >
                  <span
                    v-if="dayRate(day) !== null"
                    class="rounded px-1 py-0.5 text-[8px] leading-none sm:text-[10px]"
                    :class="
                      dayRate(day)! >= 70
                        ? ' bg-emerald-50 text-emerald-700  dark:bg-emerald-950/70 dark:text-emerald-400'
                        : ' bg-amber-50 text-amber-700  dark:bg-amber-950/70 dark:text-amber-400'
                    "
                    >{{ dayRate(day) }}%</span
                  >
                </span>

                <!-- 하단 영역 : 태그 요약 (4개까지는 상세 표시, 5개부터는 +N 요약) -->
                <div
                  v-if="tagSummary(day).length"
                  class="w-full hidden flex-wrap items-center gap-x-2 gap-y-0.5 overflow-hidden sm:flex"
                >
                  <!-- 최대 4개까지만 점+숫자 -->
                  <span
                    v-for="summary in tagSummary(day).slice(0, 4)"
                    :key="summary.tag"
                    class="inline-flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400"
                  >
                    <i
                      class="size-1.5 shrink-0 rounded-full"
                      :style="{ backgroundColor: tagColor(summary.tag) }"
                    />{{ summary.completed }}/{{ summary.total }}
                  </span>

                  <!-- 태그 5개 이상, 남은 개수를 +N 형태 -->
                  <span
                    v-if="tagSummary(day).length > 4"
                    class="text-[10px] font-bold text-slate-400 dark:text-slate-500"
                  >
                    +{{ tagSummary(day).length - 4 }}
                  </span>
                </div>

                <span
                  v-else-if="isSameMonth(day, visibleMonth)"
                  class="w-full hidden text-[9px] text-slate-400 dark:text-slate-500 sm:block"
                  >기록 없음</span
                >
              </button>
            </div>
          </div>

          <!-- 우측 : 선택된 날짜의 할 일 목록 -->
          <div
            class="relative lg:h-full border-t border-slate-200 dark:border-slate-700 lg:border-t-0"
          >
            <aside class="flex flex-col bg-slate-50 dark:bg-slate-950/35 lg:absolute lg:inset-0">
              <!-- 상단 : 날짜 및 달성률 -->
              <div
                class="shrink-0 border-b border-slate-200 px-5 py-4 dark:border-slate-700 sm:px-6 sm:py-5"
              >
                <div class="flex items-center justify-between gap-3 text-sm">
                  <h3 class="text-lg font-bold">
                    {{ format(selectedDate, 'M월 d일 (EEE)', { locale: ko }) }}
                  </h3>
                  <span
                    v-if="selectedTodos.length"
                    class="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-400"
                    >달성률 {{ selectedCompleted }}/{{ selectedTodos.length }} 완료 ({{
                      selectedRate
                    }}%)</span
                  >
                </div>
              </div>

              <!-- 하단 : 선택한 날짜의 할 일 -->
              <div class="flex-1 overflow-y-auto p-5 sm:p-6 justify-center">
                <ul v-if="selectedTodos.length" class="gap-4 space-y-2.5">
                  <li v-for="todo in selectedTodos" :key="todo.id">
                    <label
                      class="relative flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/70 dark:hover:bg-slate-800"
                    >
                      <input
                        :checked="todo.completed"
                        type="checkbox"
                        class="peer sr-only"
                        @change="store.toggleTodo(todo.id)"
                      />
                      <span
                        class="grid size-6 shrink-0 place-items-center rounded-full border-2 border-slate-300 text-sm text-transparent peer-checked:border-transparent peer-checked:text-white dark:border-slate-500"
                        :class="
                          todo.completed
                            ? 'check-pop text-white'
                            : 'border-slate-300 dark:border-slate-600'
                        "
                        :style="
                          todo.completed ? { backgroundColor: tagColor(todo.tag) } : undefined
                        "
                        >✓</span
                      >
                      <span
                        class="min-w-0 flex-1 text-sm"
                        :class="
                          todo.completed
                            ? 'text-slate-400 line-through dark:text-slate-500'
                            : 'text-slate-700 dark:text-slate-200'
                        "
                        >{{ todo.title }}</span
                      >
                      <span
                        class="shrink-0 rounded-full px-2 py-1 text-[11px]"
                        :style="{
                          color: tagColor(todo.tag),
                          backgroundColor: `${tagColor(todo.tag)}18`,
                        }"
                        >{{ todo.tag }}</span
                      >
                    </label>
                  </li>
                </ul>
                <div v-else class="flex h-full items-center py-16 text-center justify-center">
                  <div>
                    <p class="text-slate-300 dark:text-slate-700">
                      <FlEmojiSad class="inline-block size-8" />
                    </p>
                    <p class="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                      이 날짜에는 기록이 없어요
                    </p>
                    <p class="mt-1 text-xs text-slate-400 dark:text-slate-600">
                      기록이 있는 다른 날짜를 선택해 주세요.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  </Teleport>
</template>
