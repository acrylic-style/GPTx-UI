import { app, shell, BrowserWindow, Tray, Menu, desktopCapturer } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
// @ts-ignore
import icon from '../assets/logo.png?asset'

let mainWindow: BrowserWindow = null
function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    icon,
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
    mainWindow.loadURL('https://gptx.acrylicstyle.xyz')
  }

  mainWindow.on('close', e => {
    e.preventDefault()
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
let appIcon: Tray = null
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('xyz.acrylicstyle.gptx')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  appIcon = new Tray(icon)
  const screenshot = (size: { width: number, height: number }) => async () => {
    appIcon.closeContextMenu()
    const sources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: size,
    })
    mainWindow.webContents.send('screenshot', sources.map(e => e.thumbnail.toDataURL()))
    mainWindow.show()
    mainWindow.maximize()
  }
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Take Screenshot as 3840x2160 (3680x2070)',
      type: 'normal',
      click: screenshot({ width: 3680, height: 2070 }),
    },
    {
      label: 'Take Screenshot as 1920x1080 (1760x990)',
      type: 'normal',
      click: screenshot({ width: 1760, height: 990 }),
    },
    {
      label: 'Take Screenshot as 1600x900 (1440x810)',
      type: 'normal',
      click: screenshot({ width: 1440, height: 810 }),
    },
    {
      label: 'Take Screenshot as 1280x720 (1120x630)',
      type: 'normal',
      click: screenshot({ width: 1120, height: 630 }),
    },
    {type: 'separator'},
    {
      label: 'Quit GPTx',
      type: 'normal',
      click: () => app.quit(),
    },
  ])
  appIcon.on('click', () => {
    mainWindow.show()
  })
  appIcon.setToolTip('GPTx')
  appIcon.setContextMenu(contextMenu)
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
// In GPTx, this is handled in the context menu in the tray icon.
// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit()
//   }
// })

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
