<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'
import { AkCalendar } from '@kalimahapps/vue-icons'
const theme = useThemeStore()
const today = new Intl.DateTimeFormat('ko-KR', {
  month: 'long',
  day: 'numeric',
  weekday: 'short',
}).format(new Date())
</script>

<template>
  <header
    class="border-b border-blue-100 bg-[#f7f9ff] transition-colors dark:border-slate-800 dark:bg-[#0d1728]"
  >
    <div class="mx-auto flex h-16 max-w-384 items-center justify-between px-5 sm:px-6">
      <div class="flex items-center gap-3">
        <div class="grid size-9 place-items-center rounded-xl bg-blue-600 text-white shadow-sm">
          <svg
            viewBox="0 0 24 24"
            class="size-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="m5 7 2 2 4-4M5 15l2 2 4-4M13 8h6M13 16h6" />
          </svg>
        </div>
        <strong class="text-lg tracking-tight">TaskFlow</strong>
        <span
          class="rounded bg-blue-100 px-1.5 py-0.5 text-[11px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300"
          >TODO</span
        >
      </div>
      <div class="flex items-center gap-3">
        <span
          class="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs text-slate-600 sm:inline dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 flex items-centers"
          ><AkCalendar class="inline-block mr-1.5" />{{ today }}</span
        >
        <button
          class="grid size-10 place-items-center rounded-xl bg-slate-100 text-lg transition hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-blue-500 dark:bg-slate-800 dark:hover:bg-slate-700"
          :aria-label="theme.isDark ? '라이트 모드로 전환' : '다크 모드로 전환'"
          @click="theme.toggleTheme"
        >
          <span aria-hidden="true">{{ theme.isDark ? '☀' : '☾' }}</span>
        </button>
      </div>
    </div>
  </header>
</template>
