import {useTransaction} from "@/util/db";

export type GeneratedImageHistoryEntry = {
  id: string
  title?: string | null
  prompt: string
  images: Array<{
    b64_json: string
    revised_prompt: string
  }>
}

const KEY = 'generate_image_history'

export const saveHistory = (current: GeneratedImageHistoryEntry) => {
  return useTransaction(KEY, KEY, store => store.put(JSON.parse(JSON.stringify(current)), String(current.id)))
}

export const deleteHistory = (id: string) => {
  return useTransaction(KEY, KEY, store => store.delete(String(id)))
}

export const loadHistory = (id: string): Promise<GeneratedImageHistoryEntry | null> => {
  return useTransaction(KEY, KEY, store => store.get(String(id)) || null)
}

export const loadAllHistory = (): Promise<Array<GeneratedImageHistoryEntry>> => {
  return useTransaction(KEY, KEY, store => store.getAll())
}
