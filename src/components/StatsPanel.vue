<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useTodoStore } from '@/stores/todos'
import { MdOutlinedBarChart, BxSolidDoughnutChart } from '@kalimahapps/vue-icons'
const store = useTodoStore()
const { completionRate, completedCount, todayTodos, tagStats } = storeToRefs(store)
const stroke = 339.292 // 원주 (2πr, r=54)
// 태그별 색상 지정
const colors = { 일: '#3b82f6', 공부: '#ec4899', 운동: '#10b981', 개인: '#a855f7' }
</script>
<template>
  <aside class="space-y-4">
    <!-- 오늘의 달성률 -->
    <section
      class="rounded-2xl border border-blue-100 bg-white p-4 dark:border-slate-700 dark:bg-[#152033]"
    >
      <div
        class="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-700"
      >
        <h2 class="text-sm font-bold flex items-center">
          <BxSolidDoughnutChart class="inline-block mr-1.5" />오늘의 달성률
        </h2>
        <span class="text-xs font-bold text-emerald-500">진행 중</span>
      </div>
      <div class="relative mx-auto my-7 size-40">
        <svg class="size-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="currentColor"
            stroke-width="12"
            class="text-blue-50 dark:text-slate-800"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="#0b55ca"
            stroke-width="12"
            stroke-linecap="round"
            :stroke-dasharray="stroke"
            :stroke-dashoffset="stroke * (1 - completionRate / 100)"
            class="transition-all duration-500"
          />
        </svg>
        <div class="absolute inset-0 grid place-content-center text-center">
          <strong class="text-2xl">{{ completionRate }}%</strong
          ><span class="text-xs text-slate-400"
            >{{ completedCount }} / {{ todayTodos.length }} 완료</span
          >
        </div>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div class="rounded-xl bg-blue-50 p-3 text-xs dark:bg-slate-800">
          <i class="mr-2 inline-block size-2.5 rounded-full bg-blue-600"></i
          ><span class="text-slate-400">완료</span
          ><strong class="block pl-5">{{ completedCount }}개</strong>
        </div>
        <div class="rounded-xl bg-blue-50 p-3 text-xs dark:bg-slate-800">
          <i class="mr-2 inline-block size-2.5 rounded-full bg-slate-300"></i
          ><span class="text-slate-400">진행 중 / 남음</span
          ><strong class="block pl-5">{{ todayTodos.length - completedCount }}개</strong>
        </div>
      </div>
    </section>
    <!-- 태그별 진행 현황 -->
    <section
      class="rounded-2xl border border-blue-100 bg-white p-4 dark:border-slate-700 dark:bg-[#152033]"
    >
      <div
        class="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-700"
      >
        <h2 class="text-sm font-bold flex items-center">
          <MdOutlinedBarChart class="inline-block mr-1.5" />태그별 진행 현황
        </h2>
        <span class="text-xs text-slate-400">카테고리별</span>
      </div>
      <div class="mt-4 space-y-5">
        <div v-for="stat in tagStats" :key="stat.tag">
          <div class="mb-2 flex justify-between text-xs">
            <span
              ><i
                class="mr-2 inline-block size-2.5 rounded-full"
                :style="{ background: colors[stat.tag] }"
              ></i
              >{{ stat.tag }}
              <span class="text-slate-400"
                >({{ stat.total }}개 중 {{ stat.completed }}개)</span
              ></span
            ><strong :style="{ color: colors[stat.tag] }">{{ stat.rate }}%</strong>
          </div>
          <div class="h-2 overflow-hidden rounded-full bg-blue-50 dark:bg-slate-800">
            <div
              class="h-full rounded-full transition-all duration-500"
              :style="{ width: `${stat.rate}%`, background: colors[stat.tag] }"
            ></div>
          </div>
        </div>
      </div>
      <div
        class="mt-5 flex justify-between border-t border-slate-200 pt-4 text-xs text-slate-400 dark:border-slate-700"
      >
        <span
          ><i class="mr-2 inline-block size-2 rounded-full bg-emerald-500"></i>실시간 동기화
          중</span
        ><span>자동 업데이트</span>
      </div>
    </section>
  </aside>
</template>
