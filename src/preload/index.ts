import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('update', {
      downloadUpdate: () => ipcRenderer.invoke('downloadUpdate'),
      installUpdate: () => ipcRenderer.invoke('installUpdate'),
      onUpdateAvailable: (callback) =>
        ipcRenderer.on('update-available', (_event, value) => callback(value)),
      onUpdateDownloaded: (callback) =>
        ipcRenderer.on('update-downloaded', (_event, value) => callback(value)),
      onDownloadProgress: (callback) =>
        ipcRenderer.on('download-progress', (_event, value) => callback(value))
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
