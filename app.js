const express = require('express');
const app = express();
const http = require('http').Server(app);
const socketIO = require('socket.io')(http);

const port = process.env.PORT || 8080;

app.use(express.static(`${__dirname}/public/dist`));

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/public/dist/index.htnl`);
});

app.get('/onlineusers', function(req, res) {
   res.send(socketIO.sockets.adapter.rooms);
});

http.listen(port, function() {
    console.log(`Listening on port:${port}`);
});

socketIO.on('connection', function(socket) {
  console.log(`A user connected: ${socket.id}`);

  // Tell all users that someone connected
  socketIO.emit('user joined', socket.id);
  
  // The client sends 'chat.message' event to server
  socket.on('chat.message', function(message){
    // Notify all clients about message
    socketIO.emit('chat.message', message);
  });
  
  // Catching client's 'user typing' event
  socket.on('user typing', function(username){
    socketIO.emit('user typing', username);
  });
  
  // Catching client's 'stopped typing' event
  socket.on('stopped typing', function(username){
    socketIO.emit('stopped typing', username);
  });
  
  socket.on('disconnect', function () {
    console.log('User left: ' + socket.id);
    
    //Tell all clients that someone disconnected
    socket.broadcast.emit('user left', socket.id);
  });

  
});