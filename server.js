var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.use(express.static('./'));

app.get('/', function (req, res) {
  res.sendFile(path.resolve(__dirname, './client/index.html'));
});

io.on('connection', function (socket) {
  console.log('user connected');
  socket.on('message', function (message) {
    io.emit('message', message);
  });

  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
})

http.listen(8080, function () {
  console.log('Server listening on port 8080');
});
