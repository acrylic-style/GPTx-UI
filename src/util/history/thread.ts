import {useTransaction} from "../db";

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
  required_action?: {
    type: 'submit_tool_outputs'
    submit_tool_outputs: {
      tool_calls: Array<{
        id: string
        type: string
        function: {
          name: string
          arguments: string
        }
      }>
    }
  } | null
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

export const messageToString = (message?: Message): string => {
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
  return useTransaction('threads', 'threads', store => store.put(JSON.parse(JSON.stringify(current)), current.id))
}

export const deleteHistory = (id: string) => {
  return useTransaction('threads', 'threads', store => store.delete(id))
}

export const loadHistory = (id: string): Promise<ThreadHistoryEntry | null> => {
  return useTransaction('threads', 'threads', store => store.get(id) || null)
}

export const loadAllHistory = async (): Promise<Array<ThreadHistoryEntry>> => {
  await migrateHistory()
  return await useTransaction('threads', 'threads', store => store.getAll())
}

const migrateHistory = async () => {
  const localStorageSave = localStorage.getItem('threads')
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
  localStorage.removeItem('threads')
}
