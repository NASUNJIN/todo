<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'
import { AkCalendar, AkSunFill, IoOutlineMoon } from '@kalimahapps/vue-icons'
import { Vue3Lottie } from 'vue3-lottie'
import logoAnimation from '@/assets/check_logo.json'
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
      <div class="flex items-center gap-0.5">
        <Vue3Lottie
          :animationData="logoAnimation"
          :height="32"
          :width="32"
          :loop="true"
          :autoplay="true"
        />
        <strong class="text-lg tracking-tight">Done It</strong>
      </div>
      <div class="flex items-center gap-3">
        <span
          class="rounded-full border-blue-10 bg-blue-50 px-3 py-1.5 text-xs text-slate-600 sm:inline dark:bg-slate-800 dark:text-slate-300 flex items-center"
          ><AkCalendar class="inline-block mr-1.5" />{{ today }}</span
        >
        <button
          class="grid size-10 place-items-center rounded-xl"
          :aria-label="theme.isDark ? '라이트 모드로 전환' : '다크 모드로 전환'"
          @click="theme.toggleTheme"
        >
          <span aria-hidden="true" class="flex items-center justify-center">
            <AkSunFill v-if="theme.isDark" class="size-5" />
            <IoOutlineMoon v-else class="size-4" />
          </span>
        </button>
      </div>
    </div>
  </header>
</template>
