import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
const STORAGE_KEY = 'doneit-theme'
export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(localStorage.getItem(STORAGE_KEY) === 'dark')
  const applyTheme = () => document.documentElement.classList.toggle('dark', isDark.value)
  const toggleTheme = () => {
    isDark.value = !isDark.value
  }
  applyTheme()
  watch(isDark, (value) => {
    localStorage.setItem(STORAGE_KEY, value ? 'dark' : 'light')
    applyTheme()
  })
  return { isDark, toggleTheme }
})
