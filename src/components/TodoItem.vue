<script setup lang="ts">
import { ref } from 'vue'
import type { Todo, TodoTag } from '@/types/todo'
import { tags } from '@/types/todo'
import { useTodoStore } from '@/stores/todos'
const props = defineProps<{ todo: Todo }>()
const store = useTodoStore()
const editing = ref(false)
const draft = ref(props.todo.title)
const draftTag = ref<TodoTag>(props.todo.tag)
const tagStyles = {
  일: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300',
  공부: 'bg-pink-50 text-pink-600 dark:bg-pink-950 dark:text-pink-300',
  운동: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300',
  개인: 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300',
}
function save() {
  store.updateTodo(props.todo.id, draft.value, draftTag.value)
  editing.value = false
}
</script>

<template>
  <li
    class="group flex min-h-14 items-center gap-3 rounded-xl border border-blue-100 bg-white px-3 py-2 transition hover:border-blue-200 dark:border-slate-700 dark:bg-[#111c2e] dark:hover:border-slate-600"
  >
    <button
      class="grid size-7 shrink-0 place-items-center rounded-full border-2 text-white transition"
      :class="
        todo.completed
          ? 'check-pop border-blue-500 bg-blue-500'
          : 'border-slate-300 dark:border-slate-600'
      "
      :aria-label="todo.completed ? '미완료로 변경' : '완료로 변경'"
      @click="store.toggleTodo(todo.id)"
    >
      <span v-if="todo.completed">✓</span>
    </button>
    <template v-if="editing">
      <input
        v-model="draft"
        class="min-w-0 flex-1 rounded-lg border border-blue-200 bg-transparent px-2 py-1 outline-none focus:ring-2 focus:ring-blue-300"
        @keyup.enter="save"
        @keyup.esc="editing = false"
      />
      <select
        v-model="draftTag"
        class="rounded-lg border border-blue-200 bg-white px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-800"
      >
        <option v-for="tag in tags" :key="tag">{{ tag }}</option>
      </select>
      <button class="text-sm font-bold text-blue-600" @click="save">저장</button>
    </template>
    <template v-else>
      <span
        class="min-w-0 flex-1 truncate text-sm"
        :class="todo.completed && 'text-slate-400 line-through'"
        >{{ todo.title }}</span
      >
      <span class="rounded-full px-2.5 py-1 text-xs" :class="tagStyles[todo.tag]">{{
        todo.tag
      }}</span>
      <div
        class="flex opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
      >
        <button
          class="p-1 text-slate-400 hover:text-blue-500"
          aria-label="수정"
          @click="editing = true"
        >
          ✎</button
        ><button
          class="p-1 text-slate-400 hover:text-rose-500"
          aria-label="삭제"
          @click="store.deleteTodo(todo.id)"
        >
          ×
        </button>
      </div>
    </template>
  </li>
</template>
