/*jshint laxcomma:true, node: true*/
var path = require('path');
var https = require('https');
var http = require('http');
var fs = require('fs');
var mongoose = require('mongoose');
var credentials = require('./credentials');
var TwigestAction = require('./lib/twigest');
var User = require('./models/twigestUser');
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
			// Comma-separate & abbreviate large integer values from Twitter API for frontend
			numFormat: function (options) {
				var num = options.fn(this).toString();
				switch (num.length) {
					// e.g. 10,000
					case 5:
						return num.slice(0,2) + "," + num.slice(2,3) + "K";
					// e.g. 100,000
					case 6:
						return num.slice(0,3) + "K";
					// e.g. 1,000,000
					case 7:
						return num.slice(0,1) + "." + num.slice(1,2) + "M";
					// e.g. 10,000,000
					case 8:
						return num.slice(0,2) + "." + num.slice(2,3) + "M";
					// e.g. 100,000,000; insanely high & so far unreached, but for good measure ¯\_(ツ)_/¯
					case 9:
						return num.slice(0,3) + "." + num.slice(3,4) + "M";
					// RegEx for comma-separation
					default:
						return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				}
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

	//twigest.getFriendIds({ userhandle: 'bkrem_', count: 20 });
	//twigest.getFriendObjects('bkrem_');
	//twigest.getVerifiedFriends('bkrem_', 100);
});

// User Handle Form Submission
app.get('/userhandle', function (req, res) {
	var handle = req.query.userhandle
	,	twigest = new TwigestAction();

	twigest.getFriendObjects({
		userhandle: handle,
		count: 12,
		callback: function (friends) {
			//console.log(friends);
			res.render('friendOverview', { user: friends, userhandle: handle });
		}
	});
});


/**
 * FILTER OPTIONS
 */

// Display verified friends only
app.get('/filter-verified', function (req, res) {
	console.log(req.query);
	res.send(null);
});


/**
 * DB OPERATIONS
 */

// Create a DB entry for every profile to be tracked
app.get('/trackid', function (req, res) {
	console.log(req.query);
	var user = new User({ twitterId: req.query.twitterId, name: req.query.name });

	user.save(function (err, user) {
		if (err) console.error('Error at MongoDB .save(): ' + err);
	});

	// TODO: Prevent duplicate user entries
	User.find(function (err, user) {
		if (err) console.error('Error at MongoDB .find(): ' + err);
		//console.log(user);
	});
	res.send(null);
});


/**
 * ERROR HANDLING
 */

// 500 page
app.use(function (err, req, res, next) {
		console.error('Server encountered following status 500 error: ' + err);
		res.status(500);
		res.render('500');
});

// 404 page
app.use(function (req, res, next) {
		res.status(404);
		res.render('404');
});


/**
 * SSL, SERVER & MONGODB INIT
 */

/* var sslOptions = {
		key: fs.readFileSync(__dirname + '/ssl/twigest.pem'),
		cert: fs.readFileSync(__dirname + '/ssl/twigest.crt')
}; */

// MongoDB environment
var opts = {
	server: {
		socketOptions: { keepAlive: 1 }
	}
};
switch (app.get('env')) {
	case 'development':
		mongoose.connect(credentials.mongo.development.connectionString, opts);
		break;
	case 'production':
		mongoose.connect(credentials.mongo.production.connectionString, opts);
		break;
	default:
		throw new Error('Unknown execution environment: ' + app.get('env'));
}


app.listen(app.get('port'), function () {
    console.log('Express server started @ http://localhost:' + app.get('port'));
});
