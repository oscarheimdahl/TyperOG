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
		type: String,
		required: true
	},
	averageWPM: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model('User', userSchema);
