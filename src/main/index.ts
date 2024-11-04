import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { autoUpdater } from 'electron-updater'
import icon from '../../resources/icon.png?asset'

let mainWindow

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

///////////////////
// Auto upadater //
///////////////////
autoUpdater.requestHeaders = { 'PRIVATE-TOKEN': '<GITLAB-TOKEN>' }
autoUpdater.autoDownload = true

console.log(autoUpdater.requestHeaders)

autoUpdater.setFeedURL(
  'https://gitlab.com/api/v4/projects/<PROJECT-ID>/jobs/artifacts/<BRANCH-NAME>/raw/dist?job=build'
)

autoUpdater.on('checking-for-update', function () {
  sendStatusToWindow('Checking for update...')
})

autoUpdater.on('update-available', function (info) {
  sendStatusToWindow('Update available.')
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    buttons: ['OK'],
    message: 'An update is available. It will be downloaded in the background.'
  })
})

autoUpdater.on('update-not-available', function (info) {
  sendStatusToWindow('Update not available.')
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    buttons: ['OK'],
    message: 'No updates are currently available.'
  })
})

autoUpdater.on('error', function (err) {
  sendStatusToWindow('Error in auto-updater.')
})

autoUpdater.on('download-progress', function (progressObj) {
  let log_message = 'Download speed: ' + progressObj.bytesPerSecond
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
  log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')'
  sendStatusToWindow(log_message)
})

autoUpdater.on('update-downloaded', function (info) {
  sendStatusToWindow(info)

  dialog
    .showMessageBox(mainWindow, {
      type: 'question',
      buttons: ['Install', 'Later'],
      defaultId: 0,
      message: 'A new version of the app has been downloaded. Install now?'
    })
    .then((result) => {
      if (result.response === 0) {
        sendStatusToWindow('Installing update...')
        autoUpdater.quitAndInstall()
      } else {
        sendStatusToWindow('Update postponed.')
      }
    })
    .catch((err) => {
      sendStatusToWindow('Update error: ' + err.message)
    })
})

autoUpdater.checkForUpdates()

function sendStatusToWindow(message): void {
  console.log(message)
}
// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
