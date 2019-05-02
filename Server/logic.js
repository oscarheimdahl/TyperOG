const gameSize = 2;

let games = [];
//TODO RESET TEMPLETES AFETER
let game = {
	players: [],
	playersDone: 0,
	id: '',
	started: false,
	startTime: null
};

let player = {
	username: '',
	progress: 0,
	game: null,
	gameIndex: null,
	goalPosition: null,
	wpm: 0,
	time: 0,
	inGoal: false
};

let sockets = [];
let players = [];

module.exports = {
	leaveOldGame: function(username) {
		players.map(player => {
			if (player.username === username) {
				this.removeFromGame(player);
				this.removeFromPlayerList(player);
				this.removeFromSocketList(player);
			}
		});
	},

	leaveIfPlayerFound: function(socket) {
		players.map(player => {
			if (player.id === socket.id) {
				this.leaveOldGame(player.username);
				console.log(player.username + ' disconnected');
			}
		});
	},

	removeFromPlayerList: function(player) {
		players.map((p, i) => {
			if (p.username === player.username) {
				removeIndex = i;
			}
		});
		players.splice(removeIndex, 1);
	},

	removeFromSocketList: function(player) {
		sockets.map(s => {
			if (s.id === player.id) {
				s.leave(player.gameIndex);
			}
		});
	},

	removeFromGame: function(player) {
		let removeIndex;
		games[player.gameIndex].players.map((p, i) => {
			if (p.username === player.username) {
				removeIndex = i;
			}
		});
		games[player.gameIndex].players.splice(removeIndex, 1);
		if (games[player.gameIndex].players.length === 0) {
			games.splice(player.gameIndex, 1);
		}
	},

	joinGame: function(socket, username) {
		console.log(username + ' connected');
		let gameIndex = this.getAvailableGame();
		player.username = username;
		player.id = socket.id;
		socket.join(gameIndex);
		player.game = gameIndex;
		player.gameIndex = gameIndex;
		sockets.push(socket);
		players.push(JSON.parse(JSON.stringify(player)));
		games[gameIndex].players.push(JSON.parse(JSON.stringify(player)));

		if (games[gameIndex].players.length > 1) {
			this.sendStartTime(socket, gameIndex);
		}
	},

	sendStartTime: function(socket, gameIndex) {
		if (!games[gameIndex].startTime) {
			games[gameIndex].startTime = Date.now() + 10 * 1000;
		}
		console.log('Should send start time');
		socket.in(gameIndex).emit('gamestart', games[gameIndex].startTime);
		socket.emit('gamestart', games[gameIndex].startTime);
	},

	getAvailableGame: function() {
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
	},

	updatePlayerProgress: function(socket, data) {
		games.map(gme => {
			gme.players.map(p => {
				if (p.id === socket.id) {
					p.progress = data.progress;
					p.wpm = data.wpm;
					p.time = data.time;
					if (p.progress === 1 && !p.inGoal) {
						games[p.gameIndex].playersDone++;
						console.log(games[p.gameIndex].playersDone);
						p.inGoal = true;
						p.goalPosition = games[p.gameIndex].playersDone;
					}
					this.broadcastProgress(socket, gme.players);
				}
			});
		});
	},

	broadcastProgress: function(socket, playersInGame) {
		socket
			.in(
				Object.keys(socket.rooms).filter(function(item) {
					return item !== socket.id;
				})[0]
			)
			.emit('progress', playersInGame);
		socket.emit('progress', playersInGame);
	}
};
