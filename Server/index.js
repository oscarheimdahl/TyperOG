require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const cors = require('cors');
const mongoose = require('mongoose');

app.use(cors());
app.use(express.static('public/'));
app.use(require('./api/routes/users'));
app.use(require('./api/routes/texts'));

mongoose.connect('mongodb://localhost:27017/Typer', {
	useNewUrlParser: true
});

app.get('/', function(req, res) {});

http.listen(5000, function() {
	console.log('API: port 5000');
});
