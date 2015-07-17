var Twit = require('twit');
var credentials = require('../credentials');

var TwigestAction = module.exports = function () {
	this.twigest = new Twit({
		consumer_key: credentials.twitter.consumerKey,
		consumer_secret: credentials.twitter.consumerSecret,
		app_only_auth: true
	});
};

/*
 * Fetch the full list of accounts (screen_names) which the user follows.
 * NOTE: Limited to 200 names per request.
 */
TwigestAction.prototype.getAllFriends = function (user, count) {
	
	this.twigest.get('friends/list', { screen_name: user, count: count }, function(err, data, response) {
		if (err) return console.error('Twitter API GET encountered following error: ' + err);
		
		var namesArray = [];
		var followers = data.users;
		
		for (var i = 0; i < followers.length; i++) {
			namesArray.push(followers[i].name);
		}
		console.log(namesArray);
		console.log(namesArray.length);
	});
};