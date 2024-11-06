// import { autoUpdater, ipcMain } from 'electron'

// import log from 'electron-log'

// function sendStatusToWindow(text): void {
//   log.info(text)
// }

// export async function downloadUpdates(_event, args): Promise<void> {
//   sendStatusToWindow('downloadUpdate')
//   const arr = await autoUpdater.downloadUpdate()
//   sendStatusToWindow(JSON.stringify(arr))
// }

// export const setupUpdaterIpc = (): void => {
//   ipcMain.handle('setHttpAuth', downloadUpdates)
// }
