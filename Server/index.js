const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', function(req, res) {});

app.use(express.static('public/'));
app.use(require('./routes/users.js'));

io.on('connection', function(socket) {
	console.log('an user connected');
	socket.on('disconnect', function() {
		console.log('user disconnected');
	});
	socket.on('chat message', function(msg) {
		console.log('message: ' + msg);
		socket.broadcast.emit('chat message', msg);
	});
	socket.on('important', function(msg) {
		console.log('important: ' + msg);
		socket.broadcast.emit('important', msg);
	});
});

http.listen(3000, function() {
	console.log('listening on *:3000');
});
