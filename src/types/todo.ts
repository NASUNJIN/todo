export type TodoTag = string
export interface TagDefinition {
  name: TodoTag
  color: string
  isCustom?: boolean
}

export const defaultTags: TagDefinition[] = [
  { name: '일', color: '#60a5fa' },
  { name: '공부', color: '#f472b6' },
  { name: '운동', color: '#34d399' },
  { name: '개인', color: '#c084fc' },
  { name: '기타', color: '#94a3b8' },
]

export const fallbackTag: TodoTag = '기타'

export const customTagColors = ['#fb7185', '#fb923c', '#fbbf24', '#2dd4bf', '#38bdf8', '#818cf8']
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
