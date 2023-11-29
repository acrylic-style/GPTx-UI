import { contextBridge, ipcRenderer } from 'electron'
//import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  // eslint-disable-next-line no-unused-vars
  onScreenshot: (callback: (dataUrl: Array<string>) => void) => ipcRenderer.on('screenshot', (_e, arg) => callback(arg)),
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    // contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // // @ts-ignore (defined in dts)
  // window.electron = electronAPI
  // @ts-ignore (defined in dts)
  window.api = api
}