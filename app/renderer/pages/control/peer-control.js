const EventEmitter = require('events')
const peer = new EventEmitter()

// peer-puppet
const { ipcRenderer } = require('electron')

// peer.on('robot', (type, data) => {
//   ipcRenderer.send('robot', type, data)
// })

const pc = new window.RTCPeerConnection({})

const dc = pc.createDataChannel('robotdchannel', {reliable: false})

dc.onopen = function (e) {
  peer.on('robot', (type, data) => {
    dc.send(JSON.stringify({type, data}))
  })
}

dc.onmessage = function (e) {
  console.log('message', e);
}

dc.onerror = function (err) {
  console.log('error', err);
}

// onicecandidate iceEvent
// addIceCandidate
pc.onicecandidate = function (e) {
  const candidate = e.candidate
  if (e.candidate) {
    ipcRenderer.send('forward', 'control-candidate', {
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
      await pc.addIceCandidate(new RTCIceCandidate(candidates[i]))
    }
  }
}

ipcRenderer.on('candidate', (e, data) => {
  addIceCandidate(data)
})

async function createOffer() {
  const offer = pc.createOffer({
    offerToReceiveAudio: false,
    offerToReceiveVideo: true
  })
  await pc.setLocalDescription(offer)
  return pc.localDescription
}

async function sendOffer() {
  const description = await createOffer()
  ipcRenderer.send('forward', 'offer', {type: description.type, sdp: description.sdp})
}

sendOffer()

ipcRenderer.on('answer', async (e, answer) => {
  await setRemote(answer)
  await addIceCandidate()
  candidates = []
})

async function setRemote(answer) {
  await pc.setRemoteDescription(answer)
}

pc.addEventListener('addstream', (e) => {
  console.log('add-stream', e);
  peer.emit('add-stream', e.stream)
})

module.exports = peer