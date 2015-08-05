/*jshint laxcomma:true, node: true*/
var path = require('path');
var https = require('https');
var http = require('http');
var fs = require('fs');
var TwigestAction = require('./lib/twigest');
var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({
		defaultLayout: 'main',
		helpers: {
			section: function (name, options) {
				if (!this._sections) this._sections = {}; // initialize _sections object
				this._sections[name] = options.fn(this);
				return null;
			},
			// Adds ability to comma-separate large integer values from Twitter API for frontend
			// TODO: Add "K" & "M" abbreviations
			numFormat: function (options) {
				return options.fn(this).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			}
		}
	});

// Set up handlebars view engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// Set up public directory for static files
app.use(express.static('public'));

// Set URL param 'test=1' for in-client testing
app.use(function (req, res, next) {
		res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
		next();
});

// Initialize & populate partials object for widgets
app.use(function (req, res, next) {
		if (!res.locals.partials) res.locals.partials = {};
		next();
});

// Sets port to PORT environment variable or defaults to port 3000
app.set('port', process.env.PORT || 3000);


/**
 * ROUTING
 */

// Landing Page
app.get('/', function (req, res) {
	res.render('index');
	var twigest = new TwigestAction();

	//twigest.getFriendIds('bkrem_', 20);
	//twigest.getFriendObjects('bkrem_');
	//twigest.getVerifiedFriends('bkrem_', 100);
});

// User Handle Form Submission
app.get('/userhandle', function (req, res) {
	var handle = req.query.userhandle
	,	twigest = new TwigestAction();

	twigest.getFriendObjects({
		user: handle,
		callback: function (friends) {
			console.log(friends);
			res.render('friendOverview', {user: friends});
		}
	});
});

app.post('/trackid', function (req, res) {
	res.send(console.log(req));
});


/**
 * ERROR HANDLING
 */

// 500 page
app.use(function (err, req, res, next) {
		console.error('Server encountered following error: ' + err);
		res.status(500);
		res.render('500');
});

// 404 page
app.use(function (req, res, next) {
		res.status(404);
		res.render('404');
});


/**
 * SSL, SERVER & SOCKET.IO INIT
 */

/* var sslOptions = {
		key: fs.readFileSync(__dirname + '/ssl/twigest.pem'),
		cert: fs.readFileSync(__dirname + '/ssl/twigest.crt')
}; */

app.listen(app.get('port'), function () {
    console.log('Express server started @ http://localhost:' + app.get('port'));
});
