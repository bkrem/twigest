/*jshint laxcomma:true, node: true*/
var path = require('path');
var https = require('https');
var http = require('http');
var fs = require('fs');
var mongoose = require('mongoose');
var credentials = require('./credentials');
var Twigest = require('./lib/twigest');
var TrackedUser = require('./models/trackedUser');
var dbOps = require('./lib/dbOps');
var keywords = require('./lib/filterKeywords');
var express = require('express');
var handlebars = require('./config/handlebars-config');
var NodeCache = require('node-cache');

var app = express();
var twigest = new Twigest();
var twigestCache = new NodeCache();

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

	//twigest.getFriendIds({ userhandle: 'bkrem_', count: 20 });
	//twigest.getFriendObjects({ userhandle: 'bkrem_', callback: function (data) {console.log(data);} });
	//twigest.getVerifiedFriends( { userhandle: 'bkrem_', count: 100, callback: function (data) {console.log(data);} });
});

// User Handle Form Submission
app.get('/userhandle', function (req, res) {
	var handle = req.query.userhandle;

	// TODO: Fix setTwigestCache() scope, change this
	twigestCache.set("sessionUserhandle", handle, function (err, success) {
		if (err) return console.error('twigestCache SET ' + 'sessionUserhandle' + ' failed: ' + err);
		console.log('twigestCache created key for ' + 'sessionUserhandle' + ': ' + success);
	});

	twigest.getFriendObjects({
		userhandle: handle,
		//count: 20,
		callback: function (friends) {
			//console.log(friends);
			if (friends instanceof Error) {
				res.send("Sorry that user handle seems to be incorrect! <a href='/'>Back</a>");
			} else {
				res.render('friendOverview', { user: friends, userhandle: handle });
			}
		}
	});
});


/**
 * FILTER OPTIONS
 */

// Display verified friends only
// FIXME: Figure out persistence of userhandle AJAX for filters.
app.get('/show-verified', function (req, res) {
	var userhandle = req.query.handle;
	console.log(userhandle);

	twigest.getVerifiedFriends({
		user: userhandle,
		callback: function (verifiedFriends) {
			res.render('friendOverview', { user: verifiedFriends, userhandle: userhandle });
		}
	});
});

app.get('/show-tech', function (req, res) {
	var userhandle = req.query.handle;

	twigest.getTechFriends({
		user: userhandle,
		callback: function (techFriends) {
			res.render('friendOverview', { user: techFriends, userhandle: userhandle });
		}
	});
});

app.get('/show-sports', function (req, res) {
	var userhandle = req.query.handle;

	twigest.getSportsFriends({
		user: userhandle,
		callback: function (sportsFriends) {
			res.render('friendOverview', { user: sportsFriends, userhandle: userhandle });
		}
	});
});


/**
 * DB OPERATIONS
 */

// Create a DB entry for every profile to be tracked
app.get('/trackid', function (req, res) {
	try {
		dbOps.trackUser(req);
	} catch (e) {
		throw new Error("Encountered error at dbOps.trackUser(): " + e);
	}
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
