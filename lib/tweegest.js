/*jshint node: true*/
var Twit = require('twit');
var credentials = require('../credentials');

var TweegestAction = module.exports = function () {
	this.twigest = new Twit({
		consumer_key: credentials.twitter.consumerKey,
		consumer_secret: credentials.twitter.consumerSecret,
		app_only_auth: true
	});
};


/**
 * Fetch IDs of accounts which the user follows (friends).
 * 
 * @param {user} screen_name for which to retrieve friends
 * @param {count} number of users to retrieve
 */

TweegestAction.prototype.getFriendIds = function (user, count, callback) {
	var MAX_ID = 5000; // Twitter API: Maximum number of IDs per request
	
	this.twigest.get('friends/ids', { screen_name: user, count: count || MAX_ID }, function(err, data) {
		if (err) return console.error('Twitter API GET for friends/ids encountered error: ' + err);
		var ids = data.ids; // Array
		
		callbackAndReturn(callback, ids);
	});
};


/**
 * Fetch full user objects using IDs from getFriendsIds()
 */

TweegestAction.prototype.getFriendObjects = function (user, count, callback) {
	var self = this;
	var MAX_OBJ = 100; // Twitter API: Maximum number of objects per request
	
	this.getFriendIds(user, count, function (ids) {
		var idBlock = [];
		for (var i = 0; i < MAX_OBJ; i++) { idBlock.push(ids[i]); }
		
		self.twigest.get('users/lookup', { user_id: idBlock }, function (err, data) {
			if (err) return console.error('Twitter API GET for users/lookup encountered error: ' + err);
			
			callbackAndReturn(callback, data);
		});
	});
};

/**
 * Fetch verified friends ONLY
 */

TweegestAction.prototype.getVerifiedFriends = function (user, count, callback) {
	
	this.getFriendObjects(user, count, function (friends) {
		var verifiedFriends = friends.filter(function (friend) { return friend.verified === true; });
		console.log(verifiedFriends);
		callbackAndReturn(callback, verifiedFriends);
	});
};


/**
 * Helpers
 */

// Check if a valid callback is present and return
var callbackAndReturn = function (callback, data) {
	if (callback && typeof callback === 'function') {
		callback(data);
		console.log('Callback true');
	}
	else if (callback && typeof callback !== 'function') {
		return console.error('Invoked callback is not a function.');
	}
	return data;
};