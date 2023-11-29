import {useTransaction} from "../db";

export type JsonContentText = {
  type: 'text'
  text: string
}

export type JsonContentImageUrl = {
  type: 'image_url'
  image_url: string
}

export type JsonContent = JsonContentText | JsonContentImageUrl

export type TextContent = string

export type JsonMessage = {
  content: Array<JsonContent>
  role: 'system' | 'user' | 'assistant'
}

export type TextMessage = {
  content: TextContent
  role: 'system' | 'user' | 'assistant'
}

export type HistoryEntry = {
  id: string
  title?: string | null
  messages: Array<TextMessage | JsonMessage>
}

export const contentToString = (content?: JsonMessage | TextMessage): string => {
  if (!content) return ''
  if (typeof content.content === 'string') {
    return content.content
  } else {
    const found = content.content.find(e => e.type === 'text') as unknown as JsonContent
    if (found.type !== 'text') return ''
    return found.text
  }
}

export const saveHistory = (current: HistoryEntry) => {
  return useTransaction('history', 'history', store => store.put(JSON.parse(JSON.stringify(current)), String(current.id)))
}

export const deleteHistory = (id: string) => {
  return useTransaction('history', 'history', store => store.delete(String(id)))
}

export const loadHistory = (id: string): Promise<HistoryEntry | null> => {
  return useTransaction('history', 'history', store => store.get(String(id)) || null)
}

export const loadAllHistory = async (): Promise<Array<HistoryEntry>> => {
  await migrateHistory()
  return await useTransaction('history', 'history', store => store.getAll())
}

const migrateHistory = async () => {
  const localStorageSave = localStorage.getItem('save')
  if (!localStorageSave) return
  const parsed = JSON.parse(localStorageSave)
  if (!parsed) return
  const keys = Object.keys(parsed)
  if (keys.length === 0) return
  for (const key of keys) {
    const value = parsed[key]
    if (!value) continue
    await saveHistory(value)
  }
  localStorage.removeItem('save')
}
