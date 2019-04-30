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

mongoose.connect('mongodb://localhost:27017/Typer', {
	useNewUrlParser: true
});

let users = [
	{ username: 'oscar', progress: 0 },
	{ username: 'kalle', progress: 0 }
];

let games = [];

let game = {
	players: [],
	winner: '',
	id: ''
};

let player = {
	username: '',
	progress: 0,
	id: null
};

app.get('/', function(req, res) {});

io.on('connection', socket => {
	//socket.broadcast.to(socket.id).emit('gameID', getAvailableGame());
	//välkommen du ska vara i rum x
	socket.join(getAvailableGame());

	socket.on('progress', msg => {
		console.log(
			msg.username + ': progress: ' + Math.round(msg.data * 100) + '%'
		);
		socket.broadcast
			.to(
				Object.keys(socket.rooms).filter(function(item) {
					return item !== socket.id;
				})[0]
			)
			.emit('hello', 'tjena rummet');
	});

	//io.sockets.in("room-"+roomno).emit('connectToRoom', "You are in room no. "+roomno);
});

function getAvailableGame() {
	return 'game2';
}

/* io.on('connection', function(socket) {
	// console.log('user:', socket.handshake.address);
	socket.on('join', username => {
		console.log('User ' + username + ' joined');
	});
	socket.on('disconnect', function() {
		console.log('user disconnected');
	});
	socket.on('progress', function(msg) {
		console.log(
			msg.username + ': progress: ' + Math.round(msg.data * 100) + '%'
		);
		users.map(user => {
			if (user.username === msg.username) user.progress = msg.data;
		});
		socket.broadcast.emit('progress', users);
	});
	socket.on('time', function(msg) {
		console.log('Time:     ' + (msg.data / 1000).toFixed(2) + ' seconds');
	});
	socket.on('wpm', function(msg) {
		console.log('Speed:    ' + Math.round(msg.data) + ' wpm');
	});
	socket.on('important', function(msg) {
		console.log('important: ' + msg);
		socket.broadcast.emit('important', msg);
	});
}); */

http.listen(4000, function() {
	console.log('listening on *:4000');
});
