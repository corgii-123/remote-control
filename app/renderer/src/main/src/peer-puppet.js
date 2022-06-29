const {desktopCapturer, ipcRenderer} = window.require('electron')

async function getScreenStream() {
  // 获取桌面流
  const sources = await desktopCapturer.getSources({ types: ['screen'] })
  // 媒体流默认是获取摄像头
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: sources[0].id,
        maxWidth: 1920,
        maxHeight: 1080
      }
    }
  })
  return stream
}

let pc = new window.RTCPeerConnection({})

pc.ondatachannel = (e) => {
  e.channel.onmessage = (e) => {
    let { type, data } = JSON.parse(e.data)
    if (type === 'mouse') {
      data.screen = {
          width: window.screen.width,
          height: window.screen.height
        }
    }
    ipcRenderer.send('robot', type, data)
  }
}

// onicecandidate iceEvent
// addIceCandidate
pc.onicecandidate = function (e) {
  const candidate = e.candidate
  if (e.candidate) {
    ipcRenderer.send('forward', 'puppet-candidate', {
      candidate: candidate.candidate,
      sdpMid: candidate.sdpMid,
      sdpMLineIndex: candidate.sdpMLineIndex
    })
  }
}

let candidates = []
async function addIceCandidate(candidate) {
  if (candidate) {
    candidates.push(candidate)
  }
  if (pc.remoteDescription && pc.remoteDescription.type) {
    for (let i = 0; i < candidates.length; i++) {
      console.log(candidates[i]);
      await pc.addIceCandidate(new RTCIceCandidate(candidates[i]))
    }
  }
}

ipcRenderer.on('candidate', (e, data) => {
  addIceCandidate(data)
})

async function createAnswer(offer) {
  let screenStream = await getScreenStream()
  pc.addStream(screenStream)
  await pc.setRemoteDescription(offer)
  await pc.setLocalDescription(await pc.createAnswer())
  return pc.localDescription
}

ipcRenderer.on('offer', async (e, offer) => {
  const description = await createAnswer(offer)
  ipcRenderer.send('forward', 'answer', { type: description.type, sdp: description.sdp })
  await addIceCandidate()
  candidates = []
})

ipcRenderer.on('exit-be-controlled', () => {
  pc = new window.RTCPeerConnection({})
  pc.ondatachannel = (e) => {
    e.channel.onmessage = (e) => {
      let { type, data } = JSON.parse(e.data)
      if (type === 'mouse') {
        data.screen = {
            width: window.screen.width,
            height: window.screen.height
          }
      }
      ipcRenderer.send('robot', type, data)
    }
  }
})
