<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useTodoStore } from '@/stores/todos'
import type { ArchiveDay } from '@/types/todo'
import { AkHistory, MdRoundAutoGraph, RaCalendar } from '@kalimahapps/vue-icons'
const store = useTodoStore()
const { archive, weeklyCompletionRate } = storeToRefs(store)
const DAY_IN_MS = 24 * 60 * 60 * 1000

const archiveGroups = computed(() => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = today.getTime() - DAY_IN_MS
  const dayFromMonday = (today.getDay() + 6) % 7
  const startOfThisWeek = today.getTime() - dayFromMonday * DAY_IN_MS
  const groups: Array<{ label: string; days: ArchiveDay[] }> = [
    { label: '어제', days: [] },
    { label: '이번주', days: [] },
    { label: '지난주', days: [] },
  ]

  for (const day of archive.value) {
    if (day.timestamp === yesterday) groups[0]!.days.push(day)
    else if (day.timestamp >= startOfThisWeek) groups[1]!.days.push(day)
    else groups[2]!.days.push(day)
  }

  return groups.filter((group) => group.days.length > 0)
})

function badgeStyle(tag: string) {
  const color = store.tagColor(tag)
  return {
    color,
    backgroundColor: color + '1a',
  }
}
</script>

<template>
  <aside class="space-y-4">
    <section
      class="rounded-2xl border border-blue-100 bg-white p-4 dark:border-slate-700 dark:bg-[#152033]"
    >
      <div
        class="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-700"
      >
        <h2 class="font-bold flex items-center">
          <AkHistory class="inline-block mr-1" />과거 기록
        </h2>
        <span class="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-400 dark:bg-slate-800"
          >최근 7일</span
        >
      </div>
      <div v-for="group in archiveGroups" :key="group.label" class="mt-4">
        <p class="text-xs text-slate-400">{{ group.label }}</p>
        <div class="mt-2 space-y-2">
          <article
            v-for="day in group.days"
            :key="day.timestamp"
            class="rounded-xl border border-blue-100 bg-slate-50/60 p-3 dark:border-slate-700 dark:bg-slate-800/40"
          >
            <div class="flex items-center justify-between gap-2 text-sm">
              <strong>{{ day.date }} ({{ day.day }})</strong>
              <span
                class="whitespace-nowrap rounded-md px-2 py-1 text-xs"
                :class="
                  day.completed / day.total < 0.5
                    ? 'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300'
                    : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                "
                >{{ day.completed }}/{{ day.total }} 완료 ({{
                  Math.round((day.completed / day.total) * 100)
                }}%)</span
              >
            </div>
            <p class="mt-2 truncate text-xs text-slate-500 dark:text-slate-400">
              {{ day.summary }}
            </p>
            <div v-if="Object.keys(day.tags).length" class="mt-2 flex flex-wrap gap-1">
              <span
                v-for="(count, tag) in day.tags"
                :key="tag"
                class="rounded px-1.5 py-0.5 text-[11px]"
                :style="badgeStyle(tag)"
                >{{ tag }} {{ count }}</span
              >
            </div>
          </article>
        </div>
      </div>
      <p v-if="!archive.length" class="py-6 text-center text-xs text-slate-400">
        최근 7일간 과거 기록이 없어요.
      </p>
      <button
        class="mt-3 w-full rounded-xl border border-blue-100 bg-blue-50 py-2 text-xs font-semibold text-slate-600 hover:bg-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 flex items-center justify-center"
      >
        <RaCalendar class="inline-block mr-1.5" />캘린더로 전체 보기
      </button>
    </section>
    <div
      class="flex items-center justify-between rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-[#152033]"
    >
      <span class="text-slate-500 dark:text-slate-400"
        ><MdRoundAutoGraph class="inline-block mr-1.5" />이번 주 평균 달성률</span
      >
      <!-- 완료 50%미만일 경우 오렌지색 50% 이상일 경우 에메랄드색 -->
      <strong :class="weeklyCompletionRate < 50 ? 'text-orange-500' : 'text-emerald-500'"
        >{{ weeklyCompletionRate }}%</strong
      >
    </div>
  </aside>
</template>
