const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public/'));
const logic = require('./logic.js');

mongoose.connect('mongodb://localhost:27017/Typer', {
	useNewUrlParser: true
});

app.get('/', function(req, res) {});

io.on('connection', socket => {
	socket.on('join', (username, guest) => {
		logic.leaveOldGame(username);
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

http.listen(4000, function() {
	console.log('Client server: port 4000');
});
