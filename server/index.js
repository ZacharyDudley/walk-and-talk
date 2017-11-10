const express = require('express');
const app = express();
const socketio = require('socket.io')
const morgan = require('morgan');
const bodyParser = require('body-parser');
const router = require('./routes/');

const server = app.listen(3000, function(){
  console.log('Listening');
});

const io = socketio(server)

io.on('connect', socket => {
  let greet = 'CONNECTED TO SERVER'
  console.log(greet)
  socket.emit('greet', greet)


  socket.on('talk', blob => {
    console.log(blob)
    socket.broadcast.emit('talk', blob)
  })
})

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));

app.use('/', router);

