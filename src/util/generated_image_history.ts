export type GeneratedImageHistoryEntry = {
  id: string
  title?: string | null
  prompt: string
  images: Array<{
    b64_json: string
    revised_prompt: string
  }>
}

export const saveHistory = (current: GeneratedImageHistoryEntry) => {
  let save = localStorage.getItem('generated_images') || '{}'
  save = JSON.parse(save)
  save[current.id] = current
  localStorage.setItem('generated_images', JSON.stringify(save))
}

export const deleteHistory = (id: string) => {
  let save = localStorage.getItem('generated_images') || '{}'
  save = JSON.parse(save)
  delete save[id]
  localStorage.setItem('generated_images', JSON.stringify(save))
}

export const loadHistory = (id: string): GeneratedImageHistoryEntry | null => {
  const rawSave = localStorage.getItem('generated_images')
  if (!rawSave) return null
  const save: GeneratedImageHistoryEntry = JSON.parse(rawSave)
  if (!save[id] || !save[id].id) return
  return save
}

export const loadAllHistory = (): { [id: string]: GeneratedImageHistoryEntry } => {
  const rawSave = localStorage.getItem('generated_images')
  if (!rawSave) return {}
  return JSON.parse(rawSave)
}
