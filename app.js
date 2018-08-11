const express = require('express');
const app = express();
const http = require('http').Server(app);
const socketIO = require('socket.io')(http);

const port = process.env.PORT || 8080;

app.use(express.static(`${__dirname}/public/dist`));

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/public/dist/index.htnl`);
});

http.listen(port, function() {
    console.log(`Listening on port:${port}`);
});

socketIO.on('connection', function(socket) {
   console.log('A user connected:' + socket.id);
});