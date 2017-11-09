const socket = io(window.location.origin)

const buttonTalk = document.getElementById('talk')

let AudioContext = window.AudioContext || window.webkitAudioContext
let ac = new AudioContext()
let gainNode = ac.createGain()
let source

var gain = 2
gainNode.gain.value = gain

navigator.mediaDevices.getUserMedia({audio: true})
  .then(stream => {
    source = ac.createMediaStreamSource(stream)
    source.connect(gainNode)
    gainNode.connect(ac.destination)
  })
  .catch(err => console.error('ERROR: ', err))

ac.suspend()

/*  PRESS 'z' TO TALK  */
window.addEventListener('keydown', event => {
  if (event.keyCode === 90) {
    ac.resume()
  }
})
window.addEventListener('keyup', event => {
  if (event.keyCode === 90) {
    ac.suspend()
  }
})



//SOCKETS
socket.on('connect', () => {
  console.log('THIS IS CLIENT: ', socket.id)


  socket.on('call', call => {
    console.log(call)
    let response = 'client to server'
    socket.emit('response', response)
  })
})
