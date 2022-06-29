const { app, BrowserWindow, net } = require('electron')
const ipcHandler = require('./ipc')
const { createWindow, show: showMainWindow, close: closeMainWindow } = require('./window/main')

// 配置robotjs
app.allowRendererProcessReuse = false

const getTheLock = app.requestSingleInstanceLock()
// getTheLock = true

if (!getTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    showMainWindow()
  })

  require('./trayAndMenu/index.js')

  app.whenReady().then(() => {

    createWindow()

    console.log(net.online);
    
    require('./robot.js')()
    
    ipcHandler()

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
      }
    })

  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
}
