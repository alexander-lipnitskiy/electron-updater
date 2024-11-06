import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    update: {
      downloadUpdate: () => void
      installUpdate: () => void
      onUpdateAvailable: (callback) => void
      onUpdateDownloaded: (callback) => void
      onDownloadProgress: (callback) => void
    }
  }
}
