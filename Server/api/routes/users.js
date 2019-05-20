const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/users');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');
const checkAdminAuth = require('../middleware/check-auth-admin');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/api/users/authenticate', checkAuth, (req, res) => {
	res.json({ message: 'User is authenticated' });
});

router.post('/api/users/admin/authenticate', checkAdminAuth, (req, res) => {
	res.json({ message: 'User is authenticated' });
});

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
	console.log('signing in user');
	console.log(req.body);
	const user = new User({
		_id: new mongoose.Types.ObjectId(),
		username: req.body.username,
		password: req.body.password,
		email: req.body.email,
		admin: false,
		gamesPlayed: 0,
		averageWPM: 0
	});
	User.find()
		.where('username')
		.equals(user.username)
		.then((result, err) => {
			if (err) {
				res.status(500).json({
					error: 'Failed to get user'
				});
			}
			if (result.length > 0) {
				console.log('Username already exists');
				res.status(409).json({
					usernameerror: 'Username already exists'
				});
			} else {
				bcrypt.hash(user.password, 10, (err, hash) => {
					if (err) {
						console.log('status 500');
						return res.status(500);
					} else {
						user.password = hash;
						user
							.save()
							.then(result => {
								console.log('Saving user: ' + result.username);
								res.end();
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

router.post('/api/users/admin/login', (req, res) => {
	let username = req.body.username;
	let password = req.body.password;
	User.find()
		.where('username')
		.equals(username)
		.then((results, err) => {
			if (err) {
				return res.status(500).json({
					error: 'Faild to get user' + err
				});
			}
			if (results < 1) {
				return res.status(401).json({
					message: 'Wrong username or password'
				});
			}
			bcrypt.compare(password, results[0].password, (err, result) => {
				if (err) {
					return res.status(401).json({
						message: 'Wrong username or password'
					});
				}
				if (result) {
					if (results[0].admin) {
						const token = jwt.sign(
							{
								username: results[0].username,
								userId: results[0]._id,
								admin: results[0].admin
							},
							process.env.JWT_KEY_ADMIN,
							{
								expiresIn: '1h'
							}
						);
						return res.status(200).json({
							message: 'Auth successful',
							token: token
						});
					} else {
						return res.status(401).json({
							message: 'Administrative access required'
						});
					}
				}
				return res.status(401).json({
					message: 'Wrong username or password'
				});
			});
		});
});

router.post('/api/users/login', (req, res) => {
	let username = req.body.username;
	let password = req.body.password;
	User.find()
		.where('username')
		.equals(username)
		.then((results, err) => {
			if (err) {
				return res.status(500).json({
					error: 'Faild to get user' + err
				});
			}
			if (results < 1) {
				return res.status(401).json({
					message: 'Auth failed'
				});
			}
			bcrypt.compare(password, results[0].password, (err, result) => {
				if (err) {
					return res.status(401).json({
						message: 'Auth failed'
					});
				}
				if (result) {
					console.log(username + ' logged in');
					const token = jwt.sign(
						{
							username: results[0].username,
							userId: results[0]._id,
							admin: results[0].admin
						},
						process.env.JWT_KEY,
						{
							expiresIn: '1h'
						}
					);
					return res.status(200).json({
						message: 'Auth successful',
						token: token
					});
				}
				return res.status(401).json({
					message: 'Auth failed'
				});
			});
		});
});

router.put('/api/users/update/:id', checkAdminAuth, (req, res) => {
	const id = req.params.id;
	if (req.body.password) {
		bcrypt.hash(req.body.password, 10, (err, hash) => {
			if (err) {
				return res.status(500);
			} else {
				req.body.password = hash;
				updateOneUser(id, req, res);
			}
		});
	} else {
		updateOneUser(id, req, res);
	}
});

function updateOneUser(id, req, res) {
	User.updateOne({ _id: id }, { $set: req.body }, { new: true })
		.then(doc => {
			console.log('User with id: ' + id + ' was updated!');
			console.log('These attributes where changed: ');
			for (var i in req.body) {
				if (!(i == 'token')) console.log('    ' + i);
			}
			res.status(200).json(doc);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: err });
		});
}

router.delete('/api/users/remove/:id', checkAdminAuth, (req, res) => {
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

router.post('/api/users/updatewpm/', checkAuth, (req, res) => {
	let wpm = req.body.wpm;
	let username = req.body.username;
	let latestGames = [];
	User.find()
		.where('username')
		.equals(username)
		.then(res => {
			console.log(res);
			if (res[0].latestGames) {
				latestGames = res[0].latestGames;
				if (res[0].latestGames.length >= 10) {
					latestGames.shift();
				}
			}
			latestGames.push(wpm);
			console.log(latestGames);
			console.log(res[0]._id);
			User.updateOne(
				{ _id: res[0]._id },
				{
					$set: {
						latestGames: latestGames,
						averageWPM: getAverageWPM(latestGames)
					}
				},
				{ new: true }
			)
				.then(res => {
					console.log(res);
				})
				.catch(err => {
					console.log(err);
				});
		});
});

function getAverageWPM(latestGames) {
	let sum = 0;
	latestGames.forEach(game => {
		sum += game;
	});

	return sum / latestGames.length;
}

module.exports = router;
