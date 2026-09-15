<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import type { Todo, TodoTag } from '@/types/todo'
import { useTodoStore } from '@/stores/todos'
import ConfirmDialog from './ConfirmDialog.vue'
const props = defineProps<{ todo: Todo }>()
const store = useTodoStore()
const { tags } = storeToRefs(store)
const editing = ref(false)
const draft = ref(props.todo.title)
const draftTag = ref<TodoTag>(props.todo.tag)
const showDeleteConfirm = ref(false)
function tagStyle(tag: TodoTag) {
  const color = store.tagColor(tag)
  return { color, backgroundColor: `${color}1a` }
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
    <!-- 기본 체크 색상 -->
    <!-- <button
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
</button> -->
    <!-- 완료 체크 버튼 태그별 색상으로-->
    <button
      class="grid size-7 shrink-0 place-items-center rounded-full border-2 transition"
      :class="todo.completed ? 'check-pop text-white' : 'border-slate-300 dark:border-slate-600'"
      :style="
        todo.completed
          ? {
              backgroundColor: store.tagColor(todo.tag),
              borderColor: store.tagColor(todo.tag),
            }
          : {}
      "
      :aria-label="todo.completed ? '미완료로 변경' : '완료로 변경'"
      @click="store.toggleTodo(todo.id)"
    >
      <span v-if="todo.completed">✓</span>
    </button>
    <!-- 수정 및 삭제 부분 평소엔 안보이게 하다가 호버 되면 보이게하기, 안보일땐 태그가 가장 우측으로 가게 만들기 -->
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
        <option v-for="tag in tags" :key="tag.name" :value="tag.name">{{ tag.name }}</option>
      </select>
      <button class="text-sm font-bold text-blue-600" @click="save">저장</button>
    </template>
    <template v-else>
      <span
        class="min-w-0 flex-1 truncate text-sm"
        :class="todo.completed && 'text-slate-400 line-through'"
        >{{ todo.title }}</span
      >
      <span class="rounded-full px-2.5 py-1 text-xs" :style="tagStyle(todo.tag)">{{
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
          @click="showDeleteConfirm = true"
        >
          ×
        </button>
      </div>
    </template>
    <ConfirmDialog
      v-if="showDeleteConfirm"
      title="할 일을 삭제하시겠습니까?"
      message="삭제한 할 일 데이터는 복구할 수 없습니다."
      @cancel="showDeleteConfirm = false"
      @confirm="(store.deleteTodo(todo.id), (showDeleteConfirm = false))"
    />
  </li>
</template>
