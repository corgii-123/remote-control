const isDev = require('electron-is-dev')
const { BrowserWindow } = require('electron')
const path = require('path')

let win = null
let willQuitApp = true

function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  win.on('close', (e) => {
    if (willQuitApp) {
      win = null
    } else {
      e.preventDefault()
      win.hide()
    }
  })

  if (isDev) {
    win.loadURL('http://localhost:3000')
  } else {
    win.loadFile(path.resolve(__dirname, '../../renderer/pages/main/index.html'))
  }
}

function send(channel, ...args) {
  win.webContents.send(channel, ...args)
}

function show() {
  win.show()
}

function close() {
  willQuitApp = true
  win.close()
}

module.exports = {
  createWindow,
  send,
  show,
  close
}