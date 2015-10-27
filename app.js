var express     = require('express');
var http        = require('http');
var bodyParser  = require('body-parser');
var path        = require('path');
var ejs        = require('ejs');

/*
 * Database
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/directory');

mongoose.connection
	.on('error', console.error.bind(console, 'Connection Error to MongoDB.'))
	.once('open', console.log.bind(console, "We are connected to MongoDB."));

require('./models/Contacts');

/*
 * Route
 */
var routes = require('./routes/index');

/*
 * Configuration
 */
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/*
 * Server
 */
http.createServer(app).listen(3000);

module.exports = app;
