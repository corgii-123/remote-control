const { ipcMain, Menu, MenuItem } = require('electron')
const { send: sendMainWindow } = require('./window/main')
const { createWindow: createControlWindow, send: sendControlWindow, close: closeControlWindow } = require('./window/control')
const signal = require('./signal')

module.exports = function () {
  // 页面渲染
  ipcMain.handle('login', async () => {
    // mock return code
    let { code } = await signal.invoke('login', null, 'logined')
    return code
  })
  ipcMain.on('control', async (event, remoteCode) => {
    let { remote } = await signal.invoke('control', { remote: remoteCode }, 'controlled')
    sendMainWindow('control-state-change', remote, 1)
    createControlWindow()
  })
  ipcMain.on('copy-popup', () => {
    const menu = new Menu()
    menu.append(new MenuItem({ label: '复制', role: 'copy' }))
    menu.popup()
  })
  ipcMain.on('exit-control', () => {
    closeControlWindow()
    sendMainWindow('control-state-change', null, 2)
    signal.send('exit', null)
  })
  signal.on('be-control`led', (data) => {
    sendMainWindow('control-state-change', data.remote, 0)
  })
  signal.on('error', (message) => {
    sendMainWindow('error', message)
  })
  signal.on('exit-be-controlled', () => {
    sendMainWindow('exit-be-controlled')
    sendMainWindow('control-state-change', null, 2)
  })

  // 信令部分
  ipcMain.on('forward', (e, event, data) => {
    signal.send('forward', {event, data})
  })

  signal.on('offer', (data) => {
    sendMainWindow('offer', data)
  })
  signal.on('answer', (data) => {
    sendControlWindow('answer', data)
  })
  signal.on('puppet-candidate', (data) => {
    sendControlWindow('candidate', data)
  })
  signal.on('control-candidate', (data) => {
    sendMainWindow('candidate', data)
  })
}