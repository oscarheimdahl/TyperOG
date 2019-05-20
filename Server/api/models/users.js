const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	gamesPlayed: {
		type: Number,
		required: true
	},
	averageWPM: {
		type: Number,
		required: true
	},
	latestGames: {
		type: [Number],
		required: false
	},
	admin: { type: Boolean }
});

module.exports = mongoose.model('User', userSchema);
