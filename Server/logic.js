const gameSize = 3;

let games = [];
let game = {
	players: [],
	playersDone: 0,
	id: '',
	started: false,
	startTime: null,
	dead: false
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

let texts = [
	'Bears are carnivoran mammals of the family Ursidae. They are classified as caniforms, or doglike carnivorans. Although only eight species of bears are extant, they are widespread, appearing in a wide variety of habitats throughout the Northern Hemisphere and partially in the Southern Hemisphere.',
	'Popular culture holds the year 2000 as the first year of the 21st century and the 3rd millennium due to a tendency of grouping the years according to decimal values, as if year zero were counted.',
	'Salamanders are a group of amphibians typically characterized by a lizard-like appearance, with slender bodies.'
];

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
		if (players.length === 0) {
			sockets = [];
			games = [];
		}
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
		if (games[player.gameIndex]) {
			games[player.gameIndex].players.map((p, i) => {
				if (p.username === player.username) {
					removeIndex = i;
				}
			});
			games[player.gameIndex].players.splice(removeIndex, 1);
			if (games[player.gameIndex].players.length === 0) {
				//games.splice(player.gameIndex, 1);
				games[player.gameIndex].dead = true;
			}
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
			this.sendGameText(socket, gameIndex);
			this.sendStartTime(socket, gameIndex);
		}
	},

	sendStartTime: function(socket, gameIndex) {
		if (!games[gameIndex].startTime) {
			games[gameIndex].startTime = Date.now() + 10 * 1000;
		}
		socket.in(gameIndex).emit('gamestart', games[gameIndex].startTime);
		socket.emit('gamestart', games[gameIndex].startTime);

		setTimeout(() => {
			if (games[gameIndex]) games[gameIndex].started = true;
		}, 5000);
	},

	sendGameText: function(socket, gameIndex) {
		let text = this.getRandomText();
		text = 'kalle' + Math.random();
		console.log('Sending text: ' + text);
		socket.in(gameIndex).emit('gametext', text);
		socket.emit('gametext', text);
	},

	getRandomText: function() {
		let r = Math.round(Math.random() * 3);
		return texts[r];
	},

	getAvailableGame: function() {
		let lastGameIndex = games.length - 1;
		if (games.length > 0) {
			let latestGame = games[lastGameIndex];
			let playersInLatestGame = latestGame.players.length;
			if (
				games.length > 0 &&
				playersInLatestGame < gameSize &&
				!latestGame.started &&
				!latestGame.dead
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
