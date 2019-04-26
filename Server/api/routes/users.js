const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/users');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/api/users/get', (req, res) => {
	User.find()
		.then(doc => {
			console.log('fetched users');
			res.status(200).json(doc);
		})
		.catch(err => {
			console.log('ERROR: ' + err);
			res.status(500).json({ error: err });
		});
});

router.get('/api/users/get/:id', (req, res) => {
	const id = req.params.id;
	User.findById(id)
		.then(doc => {
			console.log('fetched users');
			res.status(200).json(doc);
		})
		.catch(err => {
			console.log('ERROR: ' + err);
			res.status(500).json({ error: err });
		});
});

router.post('/api/users/sign_in', (req, res) => {
	const user = new User({
		_id: new mongoose.Types.ObjectId(),
		username: req.body.user.username,
		password: req.body.user.password,
		gamesPlayed: req.body.user.gamesPlayed,
		averageWPM: req.body.user.averageWPM
	});
	User.find()
		.where('username')
		.equals(user.username)
		.then((result, err) => {
			console.log(result.length);
			if (err) {
				res.status(500).json({
					error: 'Failed to get user'
				});
			}
			if (result.length > 1) {
				console.log('Username already exists');
				res.status(409);
				res.end();
			} else {
				bcrypt.hash(user.password, 10, (err, hash) => {
					if (err) {
						return res.status(500);
					} else {
						user.password = hash;
						user
							.save()
							.then(result => {
								console.log('saving user');
								console.log(result);
							})
							.catch(err => console.log(err));
						res.status(201).json({
							message: 'Handling Post request to /users',
							createdUser: user
						});
					}
				});
			}
		});
});

router.put('/api/users/update/:id', (req, res) => {
	const id = req.params.id;
	User.updateOne({ _id: id }, { $set: req.body }, { new: true })
		.then(doc => {
			console.log('User updated');
			res.status(200).json(doc);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: err });
		});
});

router.delete('/api/users/remove/:id', (req, res) => {
	const id = req.params.id;
	User.deleteOne()
		.where('_id')
		.equals(id)
		.then(doc => {
			console.log('deleted user');
			res.status(200).json(doc);
		})
		.catch(err => {
			console.log('ERROR: ' + err);
			res.status(500).json({ error: err });
		});
});

module.exports = router;
