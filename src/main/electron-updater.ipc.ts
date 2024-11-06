import { autoUpdater } from 'electron-updater'
import log from 'electron-log'
import { BrowserWindow, ipcMain } from 'electron'

autoUpdater.disableWebInstaller = true

autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = true
autoUpdater.logger = log

log.transports.file.level = 'info'
log.transports.file.resolvePathFn = (): any => './log.log'
log.info('App starting...')

function sendStatusToWindow(text): void {
  log.info(text)
}

export async function downloadUpdates(): Promise<void> {
  sendStatusToWindow('downloadUpdate')
  const arr = await autoUpdater.downloadUpdate()
  sendStatusToWindow(JSON.stringify(arr))
}

export async function installUpdates(): Promise<void> {
  sendStatusToWindow('quitAndInstall')
  autoUpdater.quitAndInstall()
}

export const listenElectronUpdates = (mainWindow: BrowserWindow): void => {
  autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update...')
  })
  autoUpdater.on('update-available', async (info) => {
    sendStatusToWindow(JSON.stringify(info))
    sendStatusToWindow('Update available.')
    mainWindow.webContents.send('update-available', info)
    // const arr = await autoUpdater.downloadUpdate()
    // sendStatusToWindow(JSON.stringify(arr))
  })
  autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow(JSON.stringify(info))
    sendStatusToWindow('Update not available.')
  })
  autoUpdater.on('error', (err) => {
    sendStatusToWindow('Error in auto-updater. ' + err)
  })
  autoUpdater.on('download-progress', (progressObj) => {
    let log_message = 'Download speed: ' + progressObj.bytesPerSecond
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
    log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')'
    sendStatusToWindow(log_message)
    mainWindow.webContents.send('download-progress', progressObj.percent)
  })
  autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow(JSON.stringify(info))
    sendStatusToWindow('Update downloaded')
    mainWindow.webContents.send('update-downloaded', info)
  })

  ipcMain.handle('downloadUpdate', downloadUpdates)
  ipcMain.handle('installUpdate', installUpdates)
}

export const checkElectronUpdates = (): void => {
  autoUpdater.checkForUpdates()
}
