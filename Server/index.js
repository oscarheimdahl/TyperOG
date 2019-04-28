const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
app.use(express.static('public/'));
app.use(require('./api/routes/users.js'));
app.use(require('./api/routes/texts.js'));

mongoose.connect('mongodb://localhost:27017/Typer', {
	useNewUrlParser: true
});

app.get('/', function(req, res) {});

io.on('connection', function(socket) {
	console.log('an user connected');
	console.log('user:', socket.handshake.address);
	socket.on('disconnect', function() {
		console.log('user disconnected');
	});
	socket.on('progress', function(msg) {
		console.log('Progress: ' + Math.round(msg * 100) + '%');
	});
	socket.on('time', function(msg) {
		console.log('Time:     ' + (msg / 1000).toFixed(2) + ' seconds');
	});
	socket.on('wpm', function(msg) {
		console.log('Speed:    ' + Math.round(msg) + ' wpm');
	});
	socket.on('important', function(msg) {
		console.log('important: ' + msg);
		socket.broadcast.emit('important', msg);
	});
});

http.listen(4000, function() {
	console.log('listening on *:4000');
});
