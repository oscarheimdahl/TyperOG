const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');

app.use(express.static('public/'));
const logic = require('./logic.js');

mongoose.connect('mongodb://localhost:27017/Typer', {
	useNewUrlParser: true
});

app.get('/', function(req, res) {});

io.on('connection', socket => {
	socket.on('join', (username, guest) => {
		logic.leaveOldGame(username, true);
		logic.joinGame(socket, username, guest);
	});

	socket.on('progress', msg => {
		logic.updatePlayerProgress(socket, msg.data);
	});

	socket.on('disconnect', () => {
		logic.leaveIfPlayerFound(socket);
	});

	socket.on('printGames', () => {
		logic.logGames();
	});
});

http.listen(5000, function() {
	console.log('listening on *:5000');
});
