<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import TodoItem from './TodoItem.vue'
import { tags, type TodoTag } from '@/types/todo'
import { useTodoStore } from '@/stores/todos'
const store = useTodoStore()
const { filteredTodos, completedCount, activeTag, todos, completionRate } = storeToRefs(store)
const title = ref('')
const selectedTag = ref<TodoTag>('일')
const showForm = ref(false)
const filterOptions: Array<TodoTag | '전체'> = ['전체', ...tags]
const dots = {
  전체: 'bg-white',
  일: 'bg-blue-400',
  공부: 'bg-pink-400',
  운동: 'bg-emerald-400',
  개인: 'bg-purple-400',
}
function submit() {
  store.addTodo(title.value, selectedTag.value)
  title.value = ''
  showForm.value = false
}
</script>
<template>
  <section class="space-y-4">
    <div
      class="rounded-2xl border border-blue-100 bg-white p-5 dark:border-slate-700 dark:bg-[#152033]"
    >
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span
            class="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-300"
            ><i class="mr-2 inline-block size-2 rounded-full bg-emerald-500"></i>오늘의 루틴
            집중</span
          >
          <h1 class="mt-3 text-2xl font-bold tracking-tight">오늘의 할 일</h1>
        </div>
        <div
          class="rounded-xl border border-blue-100 bg-blue-50 px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <i class="mr-2 inline-block size-2.5 rounded-full bg-emerald-500"></i
          ><span class="text-slate-500 dark:text-slate-400">달성률</span>
          <strong class="mx-2">{{ completedCount }} / {{ todos.length }} 완료</strong
          ><span
            class="rounded-md bg-emerald-50 px-2 py-1 font-bold text-emerald-600 dark:bg-emerald-950"
            >{{ completionRate }}%</span
          >
        </div>
      </div>
    </div>
    <div
      class="rounded-2xl border border-blue-100 bg-white p-4 dark:border-slate-700 dark:bg-[#152033]"
    >
      <div class="mb-3 flex items-center justify-between text-xs text-slate-400">
        <span>◇ 태그 빠른 필터 & 선택</span
        ><span class="hidden sm:block">태그를 클릭하여 필터링하거나 선택하세요</span>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="filter in filterOptions"
          :key="filter"
          class="rounded-full border px-3 py-1.5 text-sm transition"
          :class="
            activeTag === filter
              ? 'border-blue-600 bg-blue-600 text-white'
              : 'border-blue-100 bg-blue-50 text-slate-600 hover:border-blue-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
          "
          @click="activeTag = filter"
        >
          <i class="mr-1.5 inline-block size-2 rounded-full" :class="dots[filter]"></i
          >{{ filter === '전체' ? '전체 보기' : filter }}
        </button>
      </div>
    </div>
    <div
      class="rounded-2xl border border-blue-100 bg-white p-5 dark:border-slate-700 dark:bg-[#152033]"
    >
      <div
        class="flex items-center justify-between border-b border-slate-100 pb-4 text-sm dark:border-slate-700"
      >
        <div>
          <strong
            class="rounded bg-pink-50 px-2 py-1 text-pink-600 dark:bg-pink-950 dark:text-pink-300"
            >▣ 할 일 목록</strong
          ><span class="ml-3 text-xs text-slate-400"
            >총 {{ todos.length }}개 중 {{ completedCount }}개 완료</span
          >
        </div>
        <button
          v-if="completedCount"
          class="text-xs text-slate-400 hover:text-rose-500"
          @click="store.clearCompleted"
        >
          완료 항목 정리
        </button>
      </div>
      <ul v-if="filteredTodos.length" class="mt-3 space-y-2">
        <TodoItem v-for="todo in filteredTodos" :key="todo.id" :todo="todo" />
      </ul>
      <div v-else class="py-12 text-center text-sm text-slate-400">
        이 태그의 할 일이 아직 없어요.
      </div>
      <form
        v-if="showForm"
        class="mt-4 flex flex-col gap-2 rounded-xl border-2 border-dashed border-blue-200 p-3 sm:flex-row dark:border-slate-700"
        @submit.prevent="submit"
      >
        <input
          v-model="title"
          autofocus
          required
          placeholder="새로운 할 일을 입력하세요"
          class="min-w-0 flex-1 rounded-lg bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-300 dark:bg-slate-800"
        /><select
          v-model="selectedTag"
          class="rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800"
        >
          <option v-for="tag in tags" :key="tag">{{ tag }}</option></select
        ><button
          class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
        >
          추가</button
        ><button type="button" class="px-2 text-sm text-slate-400" @click="showForm = false">
          취소
        </button>
      </form>
      <button
        v-else
        class="mt-4 w-full rounded-xl border-2 border-dashed border-blue-100 py-3 text-sm text-slate-500 hover:border-blue-300 hover:text-blue-600 dark:border-slate-700 dark:text-slate-400"
        @click="showForm = true"
      >
        ⊕ 새로운 할 일 추가 (Create a new task)
      </button>
    </div>
  </section>
</template>
