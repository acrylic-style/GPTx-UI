export type File = {
  id: string,
  bytes: number
  created_at: number
  filename: string
  object: string
  purpose: string
}

export type Run = {
  id: string,
  created_at: number
  assistant_id: string
  thread_id: string
  status: 'queued' | 'in_progress' | 'requires_action' | 'cancelling' | 'cancelled' | 'failed' | 'completed' | 'expired'
  model: string | null
  instructions: string | null
  tools: any[]
  file_ids: string[]
  steps?: any[]
}

export type MessageContentTextAnnotationFileCitation = {
  type: 'file_citation'
  text: string
  file_citation: {
    file_id: string
    quote: string
  }
  start_index: number
  end_index: number
}

export type MessageContentTextAnnotationFilePath = {
  type: 'file_path'
  text: string
  file_path: {
    file_id: string
  }
  start_index: number
  end_index: number
}

export type MessageContentTextAnnotation =
  MessageContentTextAnnotationFilePath | MessageContentTextAnnotationFileCitation

export type MessageContentText = {
  type: 'text'
  text: {
    value: string
    annotations: Array<MessageContentTextAnnotation>
  }
}

export type MessageContentImageFile = {
  type: 'image_file'
  image_file: {
    file_id: string
  }
}

export type MessageContent = MessageContentText | MessageContentImageFile

export type Message = {
  id: string
  created_at: number
  thread_id: string
  role: 'system' | 'user' | 'assistant'
  content: Array<MessageContent>
  assistant_id: string
  run_id: string
  file_ids: string[]
  files?: File[]
  run?: Run
}

export type ThreadHistoryEntry = {
  id: string
  title?: string | null
  messages: Array<Message>
}

export const messageToString = (message: Message): string => {
  if (!message) return ''
  if (typeof message.content === 'string') {
    return message.content
  } else {
    const found = message.content.find(e => e.type === 'text') as unknown as MessageContentText
    if (found.type !== 'text') return ''
    return found.text.value
  }
}

export const saveHistory = (current: ThreadHistoryEntry) => {
  let save = localStorage.getItem('threads') || '{}'
  save = JSON.parse(save)
  save[current.id] = current
  localStorage.setItem('threads', JSON.stringify(save))
}

export const deleteHistory = (id: string) => {
  let save = localStorage.getItem('threads') || '{}'
  save = JSON.parse(save)
  delete save[id]
  localStorage.setItem('threads', JSON.stringify(save))
}

export const loadHistory = (id: string): ThreadHistoryEntry | null => {
  const rawSave = localStorage.getItem('threads')
  if (!rawSave) return null
  const save: ThreadHistoryEntry = JSON.parse(rawSave)
  if (!save[id] || !save[id].id || !save[id].messages) return
  return save
}

export const loadAllHistory = (): { [id: string]: ThreadHistoryEntry } => {
  const rawSave = localStorage.getItem('threads')
  if (!rawSave) return {}
  return JSON.parse(rawSave)
}
