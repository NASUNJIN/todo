<script setup lang="ts">
import { nextTick, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import TodoItem from './TodoItem.vue'
import ConfirmDialog from './ConfirmDialog.vue'
import { customTagColors, fallbackTag, type TodoTag } from '@/types/todo'
import { useTodoStore } from '@/stores/todos'
import { HiArchiveBox, HiTag } from '@kalimahapps/vue-icons'
const store = useTodoStore()
const { filteredTodos, completedCount, activeTag, todayTodos, completionRate, tags } =
  storeToRefs(store)
const title = ref('')
const selectedTag = ref<TodoTag>('일')
const showForm = ref(false)
const showTagModal = ref(false)
const showCompleted = ref(true)
const tagPendingDelete = ref<TodoTag | null>(null)
const tagName = ref('')
const tagColor = ref(customTagColors[0]!)
const tagError = ref('')
const tagNameInput = ref<HTMLInputElement | null>(null)
function openTagModal() {
  tagName.value = ''
  tagColor.value = customTagColors[0]!
  tagError.value = ''
  showTagModal.value = true
  nextTick(() => tagNameInput.value?.focus())
}
function submitTag() {
  if (!tagName.value.trim()) {
    tagError.value = '태그 이름을 입력해주세요.'
    return
  }
  if (!store.addTag(tagName.value, tagColor.value)) {
    tagError.value = '이미 사용 중인 태그 이름이에요.'
    return
  }
  selectedTag.value = tagName.value.trim()
  showTagModal.value = false
}
function submit() {
  store.addTodo(title.value, selectedTag.value)
  title.value = ''
  showForm.value = false
}
function openTodoForm() {
  if (activeTag.value !== '전체') selectedTag.value = activeTag.value
  showForm.value = true
}
function confirmTagDelete() {
  if (!tagPendingDelete.value) return
  const deletedTag = tagPendingDelete.value
  store.deleteTag(deletedTag)
  if (selectedTag.value === deletedTag) selectedTag.value = fallbackTag
  tagPendingDelete.value = null
}
const displayTodos = computed(() => {
  if (showCompleted.value) return filteredTodos.value
  return filteredTodos.value.filter((todo) => !todo.completed)
})
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
          <h1 class="mt-2 text-2xl font-bold tracking-tight">오늘의 할 일</h1>
        </div>
        <div
          class="rounded-xl border border-blue-100 bg-blue-50 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <i class="mr-2 inline-block size-2.5 rounded-full bg-emerald-500"></i
          ><span class="text-slate-500 dark:text-slate-400">달성률</span>
          <strong class="mx-2">{{ completedCount }} / {{ todayTodos.length }} 완료</strong
          ><span
            class="rounded-md bg-emerald-50 px-2 py-0.5 font-bold text-emerald-600 dark:bg-emerald-950"
            >{{ completionRate }}%</span
          >
        </div>
      </div>
    </div>
    <div
      class="rounded-2xl border border-blue-100 bg-white p-4 dark:border-slate-700 dark:bg-[#152033]"
    >
      <div class="mb-3 flex items-center justify-between text-xs text-slate-400">
        <span class="flex items-center"
          ><HiTag class="inline-block mr-1.5 scale-x-[-1]" />태그 필터 & 추가</span
        ><span class="hidden sm:block">태그를 클릭하여 필터링하거나 추가하세요</span>
      </div>
      <div class="flex flex-wrap gap-2 text-xs">
        <!-- 태그 추가 버튼 구현 -->
        <button
          class="rounded-full border px-2.5 py-1 text-sm transition flex items-center"
          :class="
            activeTag === '전체'
              ? 'border-blue-600 bg-blue-600 text-white'
              : 'border-blue-100 bg-blue-50 text-slate-600 hover:border-blue-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
          "
          @click="activeTag = '전체'"
        >
          <i class="mr-1.5 inline-block size-2 rounded-full bg-white"></i>전체 보기
        </button>
        <div
          v-for="tag in tags"
          :key="tag.name"
          class="inline-flex overflow-hidden rounded-full border text-xs transition"
          :class="
            activeTag === tag.name
              ? 'border-blue-600 bg-blue-600 text-white'
              : 'border-blue-100 bg-blue-50 text-slate-600 hover:border-blue-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
          "
        >
          <button
            class="py-1 pl-2.5 flex items-center text-sm"
            :class="tag.isCustom ? 'pr-1.5' : 'pr-2.5'"
            @click="activeTag = tag.name"
          >
            <i
              class="mr-1.5 inline-block size-2 rounded-full"
              :style="{ backgroundColor: tag.color }"
            ></i
            >{{ tag.name }}
          </button>
          <button
            v-if="tag.isCustom"
            class="border-l px-2 transition hover:bg-rose-500 hover:text-white"
            :class="
              activeTag === tag.name ? 'border-blue-500' : 'border-blue-100 dark:border-slate-700'
            "
            :aria-label="`${tag.name} 태그 삭제`"
            @click="tagPendingDelete = tag.name"
          >
            ×
          </button>
        </div>
        <button
          class="rounded-full border border-dashed border-slate-300 px-2.5 py-1 text-sm text-slate-500 transition hover:border-blue-300 hover:text-blue-600 dark:border-slate-600 dark:text-slate-300"
          @click="openTagModal"
        >
          ＋ 태그 추가
        </button>
      </div>
    </div>
    <div
      class="rounded-2xl border border-blue-100 bg-white p-5 dark:border-slate-700 dark:bg-[#152033]"
    >
      <div
        class="flex items-center justify-between border-b border-slate-100 pb-4 text-xs dark:border-slate-700"
      >
        <div class="flex items-center">
          <strong
            class="rounded bg-pink-50 px-2 py-1 text-pink-600 dark:bg-pink-950 dark:text-pink-300 flex items-center text-xs"
            ><HiArchiveBox class="inline-block mr-1.5" />할 일 목록</strong
          ><span class="ml-3 text-xs text-slate-400"
            >총 {{ todayTodos.length }}개 중 {{ completedCount }}개 완료</span
          >
        </div>
        <!-- 완료한 항목 숨기기/보기 버튼 -->
        <button
          v-if="completedCount"
          class="text-xs text-slate-400 font-semibold"
          :class="
            showCompleted
              ? 'text-slate-400 hover:text-slate-600'
              : 'text-blue-500 hover:text-blue-600'
          "
          @click="showCompleted = !showCompleted"
        >
          {{ showCompleted ? '완료 항목 숨기기' : '완료 항목 보기' }}
        </button>
      </div>

      <ul v-if="displayTodos.length" class="mt-3 space-y-2">
        <TodoItem v-for="todo in displayTodos" :key="todo.id" :todo="todo" />
      </ul>

      <div v-else class="py-12 text-center text-sm text-slate-400">
        <template v-if="filteredTodos.length > 0 && !showCompleted">
          완료된 할 일이 숨겨져 있어요.
        </template>
        <template v-else> 이 태그의 할 일이 아직 없어요. </template>
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
          placeholder="새로운 할 일을 입력하세요."
          class="min-w-0 flex-1 rounded-lg bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-300 dark:bg-slate-800"
        />
        <!-- 드롭다운 박스 디자인 수정하기 -->
        <select
          v-model="selectedTag"
          class="rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800"
        >
          <option v-for="tag in tags" :key="tag.name" :value="tag.name">
            {{ tag.name }}
          </option></select
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
        @click="openTodoForm"
      >
        ⊕ 새로운 할 일 추가
      </button>
    </div>
    <!-- 태그 모달 -->
    <Teleport to="body">
      <div
        v-if="showTagModal"
        class="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4"
        @click.self="showTagModal = false"
      >
        <form
          class="w-full max-w-sm rounded-2xl border border-blue-100 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-[#152033]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="tag-modal-title"
          @submit.prevent="submitTag"
          @keydown.esc="showTagModal = false"
        >
          <div class="flex items-center justify-between">
            <h2 id="tag-modal-title" class="font-bold">새 태그 추가</h2>
            <button
              type="button"
              class="text-xl text-slate-400 hover:text-slate-600"
              aria-label="닫기"
              @click="showTagModal = false"
            >
              ×
            </button>
          </div>
          <label
            class="mt-5 block text-xs font-semibold text-slate-500 dark:text-slate-300"
            for="tag-name"
            >태그 이름</label
          >
          <input
            id="tag-name"
            ref="tagNameInput"
            v-model="tagName"
            maxlength="20"
            placeholder="예: 독서"
            class="mt-2 w-full rounded-lg border border-blue-100 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-300 dark:border-slate-700 dark:bg-slate-800"
            @input="tagError = ''"
          />
          <fieldset class="mt-5">
            <legend class="text-xs font-semibold text-slate-500 dark:text-slate-300">
              색상 선택
            </legend>
            <div class="mt-3 flex flex-wrap gap-3">
              <label v-for="color in customTagColors" :key="color" class="cursor-pointer">
                <input
                  v-model="tagColor"
                  type="radio"
                  name="tag-color"
                  :value="color"
                  class="sr-only"
                />
                <span
                  class="grid size-9 place-items-center rounded-full border-2 transition"
                  :class="
                    tagColor === color ? 'border-slate-700 dark:border-white' : 'border-transparent'
                  "
                  ><i class="size-6 rounded-full" :style="{ backgroundColor: color }"></i
                ></span>
                <span class="sr-only">{{ color }}</span>
              </label>
            </div>
          </fieldset>
          <p v-if="tagError" class="mt-3 text-xs text-rose-500">{{ tagError }}</p>
          <div class="mt-6 flex justify-end gap-2">
            <button
              type="button"
              class="rounded-lg px-4 py-2 text-sm text-slate-400"
              @click="showTagModal = false"
            >
              취소
            </button>
            <button
              class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
            >
              추가
            </button>
          </div>
        </form>
      </div>
    </Teleport>
    <ConfirmDialog
      v-if="tagPendingDelete"
      title="태그를 삭제하시겠습니까?"
      :message="`'${tagPendingDelete}' 태그가 삭제됩니다. 이 태그를 사용한 할 일과 과거 기록은 삭제되지 않고 '기타' 태그로 이동합니다.`"
      @cancel="tagPendingDelete = null"
      @confirm="confirmTagDelete"
    />
  </section>
</template>
