const socket = io(window.location.origin)

const buttonTalk = document.getElementById('talk')

let AudioContext = window.AudioContext || window.webkitAudioContext
let ac = new AudioContext()
let gn = ac.createGain()
let source
let chunks = []
// var mediaRecorder

gn.gain.value = 2

const playback = noise => {
  source = ac.createMediaStreamSource(noise)
  source.connect(gn)
  gn.connect(ac.destination)
  // ac.start()
}

const success = stream => {
  this.mediaRecorder = new MediaRecorder(stream)


}

this.mediaRecorder.ondataavailable = event => {
  console.log('IN DATA AVAIL')
  chunks.push(event.data)
  if (chunks.length >= 700) {
    this.sendData(chunks)
    chunks = []
  }
}

this.mediaRecorder.sendData = buffer => {
  let blob = new Blob(buffer, {type: 'audio/wav'})
  socket.emit('talk', blob)
}

//SOCKETS
socket.on('connect', () => {
  console.log('THIS IS CLIENT: ', socket.id)

  navigator.mediaDevices.getUserMedia({audio: true})
    .then(res => {
      playback(res)
      success(res)
    })
    .catch(err => console.error('ERROR: ', err))

  socket.on('call', call => {
    console.log(call)
    let response = 'client to server'
    socket.emit('response', response)
  })
})


/*  ---------------------------------------  */
/*  HOLD 'z' TO TALK  */
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

/*  HOLD DOWN BUTTON TO TALK  */
document.addEventListener('mousedown', event => {
  if (event.target === buttonTalk) {
    ac.resume()
  }
})
document.addEventListener('mouseup', event => {
  if (event.target === buttonTalk) {
    ac.suspend()
  }
})
/*  ---------------------------------------  */

