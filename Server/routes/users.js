const express = require('express');
const router = express.Router();

router.get('/api/users/get', (req, res) => {
	console.log('hello');
	res.send('hello bitches');
});

module.exports = router;
