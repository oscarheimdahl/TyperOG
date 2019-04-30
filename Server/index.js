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

const gameSize = 3;

let games = [];

let game = {
	players: [],
	winner: '',
	id: '',
	started: false
};

let player = {
	username: '',
	progress: 0,
	id: null
};

let players = [];

app.get('/', function(req, res) {});

io.on('connection', socket => {
	socket.on('join', user => {
		let gameIndex = getAvailableGame();
		player.username = user;
		player.id = socket.id;
		players.push(player);
		games[gameIndex].players.push(JSON.parse(JSON.stringify(player)));
		socket.join(gameIndex);
		if (games[gameIndex].players.length > 2) {
			//startCOuntDown!
		}
	});

	socket.on('progress', msg => {
		// console.log(
		// 	msg.username + ': progress: ' + Math.round(msg.data * 100) + '%'
		// );

		updatePlayerProgress(socket, msg.data);
	});

	socket.on('disconnect', () => {
		players.map(player => {
			if (player.id === socket.id)
				console.log('Player ' + player.username + ' left.');
		});
	});

	//io.sockets.in("room-"+roomno).emit('connectToRoom', "You are in room no. "+roomno);
});

function getAvailableGame() {
	let lastGameIndex = games.length - 1;
	if (games.length > 0) {
		let latestGame = games[lastGameIndex];
		let playersInLatestGame = latestGame.players.length;
		if (
			games.length > 0 &&
			playersInLatestGame < gameSize &&
			!latestGame.started
		) {
			return lastGameIndex;
		}
	}
	games.push(JSON.parse(JSON.stringify(game)));
	return lastGameIndex + 1;
}

function updatePlayerProgress(socket, progress) {
	let gameIndex = Object.keys(socket.rooms).filter(function(item) {
		return item !== socket.id;
	})[0];
	games[gameIndex].players.map(p => {
		if (p.id === socket.id) {
			console.log('Updating progress of: ' + p.username);
			console.log(progress);
			p.progress = progress;
			broadcastProgress(socket, games[gameIndex].players);
		}
	});
}

function broadcastProgress(socket, players) {
	console.log(
		'broadcasting to room ' +
			Object.keys(socket.rooms).filter(function(item) {
				return item !== socket.id;
			})[0]
	);
	socket
		.to(
			Object.keys(socket.rooms).filter(function(item) {
				return item !== socket.id;
			})[0]
		)
		.emit('progress', players);
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
