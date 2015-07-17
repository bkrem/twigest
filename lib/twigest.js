/*jshint node: true*/
var Twit = require('twit');
var credentials = require('../credentials');

var TwigestAction = module.exports = function () {
	this.twigest = new Twit({
		consumer_key: credentials.twitter.consumerKey,
		consumer_secret: credentials.twitter.consumerSecret,
		app_only_auth: true
	});
};


/**
 * Fetch the full list of accounts which the user follows (friends).
 * 
 * @param {user} screen_name for which to retrieve friends
 * @param {count} number of users to retrieve
 * NOTE: {count} limited to 200 names per request (Twitter API).
 */

TwigestAction.prototype.getAllFriends = function (user, count, callback) {
	
	this.twigest.get('friends/list', { screen_name: user, count: count }, function(err, data, response) {
		if (err) return callback(console.error('Twitter API GET encountered error: ' + err));
		
		var friends = data.users; // Array
		//console.log(friends);
		//console.log(friends.length);
		callback(friends);
	});
};

/**
 * Fetch verified friends ONLY
 */

TwigestAction.prototype.getVerifiedOnly = function (user, count) {
	
	this.getAllFriends(user, count, function (friends) {
		var verifiedOnly = friends.filter(function (friend) { return friend.verified === true; });
		console.log(verifiedOnly);
	});
};