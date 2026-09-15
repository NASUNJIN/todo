export type TodoTag = string
export interface TagDefinition {
  name: TodoTag
  color: string
  isCustom?: boolean
}

export const defaultTags: TagDefinition[] = [
  { name: '일', color: '#3b82f6' },
  { name: '공부', color: '#ec4899' },
  { name: '운동', color: '#10b981' },
  { name: '개인', color: '#a855f7' },
]

export const customTagColors = ['#ef4444', '#f97316', '#f59e0b', '#14b8a6', '#06b6d4', '#6366f1']
export interface Todo {
  id: string
  title: string
  tag: TodoTag
  completed: boolean
  createdAt: string
}
export interface ArchiveDay {
  timestamp: number
  date: string
  day: string
  summary: string
  completed: number
  total: number
  tags: Record<TodoTag, number>
}
