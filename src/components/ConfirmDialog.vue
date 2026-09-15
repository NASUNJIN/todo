<script setup lang="ts">
defineProps<{
  title: string
  message: string
  confirmLabel?: string
}>()

defineEmits<{
  cancel: []
  confirm: []
}>()
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-60 grid place-items-center bg-slate-950/45 p-4"
      @click.self="$emit('cancel')"
    >
      <section
        class="w-full max-w-sm rounded-2xl border border-blue-100 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-[#152033]"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        @keydown.esc="$emit('cancel')"
      >
        <h2 id="confirm-title" class="font-bold">{{ title }}</h2>
        <p id="confirm-message" class="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-300">
          {{ message }}
        </p>
        <div class="mt-6 flex justify-end gap-2">
          <button
            class="rounded-lg px-4 py-2 text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            autofocus
            @click="$emit('cancel')"
          >
            아니오
          </button>
          <button
            class="rounded-lg bg-rose-600 px-4 py-2 text-sm font-bold text-white hover:bg-rose-700"
            @click="$emit('confirm')"
          >
            {{ confirmLabel ?? '삭제' }}
          </button>
        </div>
      </section>
    </div>
  </Teleport>
</template>
