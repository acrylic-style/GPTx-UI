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

export const contentToString = (content: JsonMessage | TextMessage): string => {
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
  let save = localStorage.getItem('save') || '{}'
  save = JSON.parse(save)
  save[current.id] = current
  localStorage.setItem('save', JSON.stringify(save))
}

export const deleteHistory = (id: string) => {
  let save = localStorage.getItem('save') || '{}'
  save = JSON.parse(save)
  delete save[id]
  localStorage.setItem('save', JSON.stringify(save))
}

export const loadHistory = (id: string): HistoryEntry | null => {
  const rawSave = localStorage.getItem('save')
  if (!rawSave) return null
  const save: HistoryEntry = JSON.parse(rawSave)
  if (!save[id] || !save[id].id || !save[id].messages) return
  return save
}

export const loadAllHistory = (): { [id: string]: HistoryEntry } => {
  const rawSave = localStorage.getItem('save')
  if (!rawSave) return {}
  return JSON.parse(rawSave)
}
