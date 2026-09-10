<script setup lang="ts">
import { archive } from '@/stores/todos'
const colors = {
  일: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  공부: 'bg-pink-100 text-pink-600 dark:bg-pink-950 dark:text-pink-300',
  운동: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  개인: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
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
        <h2 class="font-bold">↶ 과거 기록</h2>
        <span class="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-400 dark:bg-slate-800"
          >최근 7일</span
        >
      </div>
      <p class="mt-4 text-xs text-slate-400">어제</p>
      <div class="mt-2 space-y-2">
        <article
          v-for="(day, index) in archive"
          :key="day.date"
          class="rounded-xl border border-blue-100 bg-slate-50/60 p-3 dark:border-slate-700 dark:bg-slate-800/40"
        >
          <div class="flex items-center justify-between gap-2 text-sm">
            <strong>{{ day.date }} ({{ day.day }})</strong
            ><span
              class="whitespace-nowrap rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
              >{{ day.completed }}/{{ day.total }} 완료 ({{
                Math.round((day.completed / day.total) * 100)
              }}%)</span
            >
          </div>
          <p class="mt-2 truncate text-xs text-slate-500 dark:text-slate-400">{{ day.summary }}</p>
          <div v-if="Object.keys(day.tags).length" class="mt-2 flex flex-wrap gap-1">
            <span
              v-for="(count, tag) in day.tags"
              :key="tag"
              class="rounded px-1.5 py-0.5 text-[11px]"
              :class="colors[tag]"
              >{{ tag }} {{ count }}</span
            >
          </div>
          <p v-if="index === 0" class="sr-only">가장 최근 기록</p>
        </article>
      </div>
      <button
        class="mt-3 w-full rounded-xl border border-blue-100 bg-blue-50 py-2 text-xs font-semibold text-slate-600 hover:bg-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
      >
        ▦ 캘린더로 전체 보기
      </button>
    </section>
    <div
      class="flex items-center justify-between rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-[#152033]"
    >
      <span class="text-slate-500 dark:text-slate-400">⌁ 이번 주 평균 달성률</span
      ><strong class="text-emerald-500">82%</strong>
    </div>
  </aside>
</template>
