const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const cors = require('cors');

app.use(cors());
app.use(express.static('public/'));
app.use(require('./api/routes/users.js'));
app.use(require('./api/routes/texts.js'));
const logic = require('./logic.js');

mongoose.connect('mongodb://localhost:27017/Typer', {
	useNewUrlParser: true
});

app.get('/', function(req, res) {});

io.on('connection', socket => {
	socket.on('join', username => {
		logic.leaveOldGame(username, true);
		logic.joinGame(socket, username);
	});

	socket.on('progress', msg => {
		logic.updatePlayerProgress(socket, msg.data);
	});

	socket.on('disconnect', () => {
		logic.leaveIfPlayerFound(socket);
	});
});

http.listen(4000, function() {
	console.log('listening on *:4000');
});
