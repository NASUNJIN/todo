export const tags = ['일', '공부', '운동', '개인'] as const
export type TodoTag = (typeof tags)[number]
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
  tags: Partial<Record<TodoTag, number>>
}
