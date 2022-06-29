const { BrowserWindow } = require('electron')
const path = require('path')

let win = null

function createWindow () {
  win = new BrowserWindow({
    width: 1600,
    height: 1200,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  win.loadFile(path.resolve(__dirname, '../../renderer/pages/control/index.html'))
}

function send(channel, ...args) {
  win.webContents.send(channel, ...args)
}

function close() {
  win.close()
}

module.exports = {
  createWindow,
  send,
  close
}