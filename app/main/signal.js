const WebSocket = require('ws')
const EventEmitter = require('events')

const signal = new EventEmitter()

const ws = new WebSocket('ws://corgii-remote-test.herokuapp.com/')

ws.on('open', () => {
  console.log('correct connect');
})

ws.on('message', (message) => {
  try {
    let data = JSON.parse(message)
    signal.emit(data.event, data.data)
  } catch (err) {
    console.log('parse error', err);
  }
})

function send(event ,data) {
  ws.send(JSON.stringify({event, data}))
}

function invoke(event, data, answerEvent) {
  return new Promise((resolve, reject) => {
    send(event, data)
    signal.once(answerEvent, (data) => {
      resolve(data)
    })
    setTimeout(() => {
      reject('time out')
    }, 10 * 1000)
  })
}

signal.invoke = invoke
signal.send = send

module.exports = signal