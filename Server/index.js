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

const gameSize = 2;

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
	socket: null,
	game: null,
	gameIndex: null
};

let sockets = [];

let players = [];

app.get('/', function(req, res) {});

io.on('connection', socket => {
	console.log('NEW CONNECTION');
	socket.on('join', username => {
		leaveOldGame(username, true);
		joinGame(socket, username);
		console.log(players);
		games.map(game => {
			game.players.map(player => {
				console.log(
					'game: ' + player.gameIndex + ' ' + 'user: ' + player.username
				);
			});
		});
	});

	socket.on('progress', msg => {
		updatePlayerProgress(socket, msg.data);
	});

	socket.on('disconnect', () => {
		console.log('USER DISCONNECTED');
		players.map(player => {
			if (player.id === socket.id) {
				console.log('to be removed' + player.username);
				leaveOldGame(player.username);
			}
		});
	});
});

function leaveOldGame(username) {
	players.map(player => {
		if (player.username === username) {
			console.log('Should remove ' + player.username);
			removeFromGame(player);
			removeFromPlayerList(player);
			removeFromSocketList(player);
		}
	});
}

function removeFromPlayerList(player) {
	players.map((p, i) => {
		if (p.username === player.username) {
			removeIndex = i;
		}
	});
	players.splice(removeIndex, 1);
}

function removeFromSocketList(player) {
	sockets.map(s => {
		if (s.id === player.id) {
			s.leave(player.gameIndex);
		}
	});
}

function removeFromGame(player) {
	let removeIndex;
	games[player.gameIndex].players.map((p, i) => {
		if (p.username === player.username) {
			removeIndex = i;
		}
	});
	console.log(
		'Removing player: ' +
			games[player.gameIndex].players[removeIndex].username +
			' from game: ' +
			player.gameIndex
	);
	games[player.gameIndex].players.splice(removeIndex, 1);
}

function joinGame(socket, username) {
	let gameIndex = getAvailableGame();
	player.username = username;
	player.id = socket.id;
	socket.join(gameIndex);
	player.game = gameIndex;
	player.gameIndex = gameIndex;
	sockets.push(socket);
	players.push(JSON.parse(JSON.stringify(player)));
	games[gameIndex].players.push(JSON.parse(JSON.stringify(player)));

	if (games[gameIndex].players.length > 2) {
		//startCOuntDown!
	}
}

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

// function updatePlayerProgress(socket, progress) {
// 	let gameIndex = Object.keys(socket.rooms).filter(function(item) {
// 		return item !== socket.id;
// 	})[0];
// 	console.log('Player in room: ' + gameIndex);

// 	games[gameIndex].players.map(p => {
// 		if (p.id === socket.id) {
// 			console.log('Updating progress of: ' + p.username);
// 			console.log(progress);
// 			p.progress = progress;
// 			broadcastProgress(socket, games[gameIndex].players);
// 		}
// 	});
// }

function updatePlayerProgress(socket, progress) {
	games.map(gme => {
		gme.players.map(p => {
			if (p.id === socket.id) {
				p.progress = progress;
				broadcastProgress(socket, gme.players);
			}
		});
	});
}

// Object.keys(socket.rooms).filter(function(item) {
//     return item !== socket.id;
// })[0]

function broadcastProgress(socket, playersInGame) {
	console.log('PLAYERS IN GAME');
	console.log(playersInGame);
	socket
		.to(
			Object.keys(socket.rooms).filter(function(item) {
				return item !== socket.id;
			})[0]
		)
		.emit('progress', playersInGame);
}

http.listen(4000, function() {
	console.log('listening on *:4000');
});
