<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import ArchiveSidebar from '@/components/ArchiveSidebar.vue'
import TodoWorkspace from '@/components/TodoWorkspace.vue'
import StatsPanel from '@/components/StatsPanel.vue'
</script>

<template>
  <div
    class="min-h-screen flex flex-col bg-[#f5f7fc] text-slate-800 transition-colors dark:bg-[#090e17] dark:text-slate-100"
  >
    <AppHeader />
    <main
      class="mx-auto grid w-full max-w-384 flex-1 grid-cols-1 gap-5 px-4 py-6 lg:grid-cols-[240px_minmax(0,1fr)_240px] xl:grid-cols-[290px_minmax(520px,1fr)_290px] xl:px-6"
    >
      <ArchiveSidebar class="lg:col-start-1 lg:row-start-1" />
      <TodoWorkspace class="lg:col-start-2 lg:row-start-1" />
      <StatsPanel class="lg:col-start-3 lg:row-start-1" />
    </main>
    <footer
      class="mt-auto flex max-w-384 flex-col gap-2 border-t border-slate-200 px-6 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800"
    >
      <span>✓ Done It</span>
      <a
        href="https://lordicon.com/"
        target="_blank"
        rel="noreferrer"
        class="transition hover:text-slate-600 dark:hover:text-slate-200"
        >Animated icons by Lordicon.com</a
      >
    </footer>
  </div>
</template>
