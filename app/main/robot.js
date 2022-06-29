const { ipcMain } = require('electron')
const robot = require('robotjs')
const vkey = require('vkey')

let ratio = 1
const handleMouse = ({clientX, clientY, screen, video}) => {
  // data {clientX, clientY, screen: {width, height}, video: {width, height}}
  let x = clientX * (screen.width / video.width)
  let y = clientY * (screen.height / video.height)
  x *= ratio
  y *= ratio
  robot.moveMouse(x, y)
  robot.mouseClick()
}

const handleKey = ({ keyCode, meta, alt, ctrl, shift }) => {
  const modifiers = []
  if (meta) {
    modifiers.push('meta')
  }
  if (alt) {
    modifiers.push('alt')
  }
  if (ctrl) {
    modifiers.push('ctrl')
  }
  if (shift) {
    modifiers.push('shift')
  }
  let key = vkey[keyCode].toLowerCase()
  if (key[0] !== '<') {
    robot.keyTap(key, modifiers)
  }
}

module.exports = function () {
  ipcMain.on('robot', (e, type, data) => {
    if (type === 'mouse') {
      handleMouse(data)
    } else if(type === 'keyboard') {
      handleKey(data)
    }
  })
  ipcMain.on('set-ratio', (event, newRatio) => {
    ratio = newRatio
  })
}