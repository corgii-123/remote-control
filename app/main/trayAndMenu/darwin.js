const { app, Menu, Tray } = require('electron')
const { show: showMainWindow } = require('../window/main')
const  {create: createAboutWindow}  = require('../window/about')
const path = require('path')

function setTray() {
  global.tray = new Tray(path.resolve(__dirname, './icon_darwin.png'))
  global.tray.on('click', () => {
    showMainWindow()
  })
  global.tray.on('right-click', () => {
    contextMenu = Menu.buildFromTemplate([
      { label: '显示', click: showMainWindow },
      {label: '关于', click: createAboutWindow},
      { label: '退出', click: app.quit}
    ])
    global.tray.setContextMenu(contextMenu)
  })
}

function setMenu() {
  let appMenu = Menu.buildFromTemplate([])
  app.applicationMenu = appMenu
}

app.whenReady().then(() => {
  setMenu()
  setTray()
})