const peer = require('./peer-control')
const { ipcRenderer } = require('electron')

const imgGif = document.getElementsByTagName('img')[0]

peer.on('add-stream', (stream) => {
  play(stream)
})

let video = document.getElementById('screen-video')

function play(stream) {
  video.srcObject = stream
  // 元数据加载完成后播放
  video.onloadedmetadata = function () {
    imgGif.remove()
    video.play()
  }
}

window.onbeforeunload = function (e) {
  ipcRenderer.send('exit-control')
}

window.onkeydown = function (e) {
  peer.emit('robot', 'keyboard', {
    keyCode: e.keyCode,
    shift: e.shiftKey,
    meta: e.metaKey,
    ctrl: e.ctrlKey,
    alt: e.altKey
  })
}

video.onmouseup = function (e) {
  let data = {
    clientX: e.offsetX,
    clientY: e.offsetY,
    video: {
      width: video.offsetWidth,
      height: video.offsetHeight
    },
    // screen: {
    //   width: window.screen.width,
    //   height: window.screen.height
    // }
  }
  peer.emit('robot', 'mouse', data)
}