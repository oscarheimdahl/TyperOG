const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Text = require('../models/texts');
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/api/texts/get', (req, res) => {
	Text.find()
		.then(doc => {
			console.log('fetched texts');
			res.status(200).json(doc);
		})
		.catch(err => {
			console.log('ERROR: ' + err);
			res.status(500).json({ error: err });
		});
});

router.get('/api/texts/get/random', (req, res) => {
	Text.countDocuments().exec(function(err, count) {
		var random = Math.floor(Math.random() * count);
		Text.findOne()
			.skip(random)
			.then(result => {
				res.json(result);
			})
			.catch(err => {
				res.status(500).json({ error: err });
			});
	});
});

router.get('/api/texts/get/:id', (req, res) => {
	const id = req.params.id;
	Text.findById(id)
		.then(doc => {
			console.log('fetched text');
			res.status(200).json(doc);
		})
		.catch(err => {
			console.log('ERROR: ' + err);
			res.status(500).json({ error: err });
		});
});

router.post('/api/texts/add', (req, res) => {
	const text = new Text({
		_id: new mongoose.Types.ObjectId(),
		title: req.body.text.title,
		author: req.body.text.author,
		content: req.body.text.content
	});
	text.save()
		.then(result => {
			console.log(result);
		})
		.catch(err => console.log(err));
	res.status(201).json({
		message: 'Handling Post request to /texts',
		createdText: text
	});
});

router.put('/api/texts/update/:id', (req, res) => {
	const id = req.params.id;
	Text.updateOne({ _id: id }, { $set: req.body }, { new: true })
		.then(doc => {
			console.log('Text updated');
			res.status(200).json(doc);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: err });
		});
});

router.delete('/api/texts/remove/:id', (req, res) => {
	const id = req.params.id;
	Text.deleteOne()
		.where('_id')
		.equals(id)
		.then(doc => {
			console.log('deleted text');
			res.status(200).json(doc);
		})
		.catch(err => {
			console.log('ERROR: ' + err);
			res.status(500).json({ error: err });
		});
});

module.exports = router;
