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
 * Fetch list of accounts which the user follows (friends).
 * 
 * @param {user} screen_name for which to retrieve friends
 * @param {count} number of users to retrieve; defaults to max. 200
 * NOTE: {count} limited to 200 names per request (Twitter API)
 */

TwigestAction.prototype.getFriends = function (user, count, callback) {
	var self = this;
	
	// Get friends IDs
	this.twigest.get('friends/ids', { screen_name: user, count: count || 5000 }, function(err, data) {
		if (err) return console.error('Twitter API GET for friends/ids encountered error: ' + err);
		var ids = data.ids; // Array
		var idBlock = [];
		for (var i = 0; i < 100; i++) {
			idBlock.push(ids[i]);
		}
		
		// Convert IDs into full user objects
		self.twigest.get('users/lookup', { user_id: idBlock }, function (err, data) {
			if (err) return console.error('Twitter API GET for users/lookup encountered error: ' + err);
			//console.log(data);
			callback(data);
		});
	});
};

/**
 * Fetch verified friends ONLY
 */

TwigestAction.prototype.getVerifiedFriends = function (user, count) {
	
	this.getFriends(user, count, function (friends) {
		var verifiedFriends = friends.filter(function (friend) { return friend.verified === true; });
		console.log(verifiedFriends);
		console.log(verifiedFriends.length);
	});
};