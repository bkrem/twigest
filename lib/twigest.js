/*jshint laxcomma:true, node: true*/
var Twit = require('twit');
var credentials = require('../credentials');

/**
 * CONSTANTS
 */
var MAX_ID = 5000; // Twitter API: Maximum number of IDs per request
var MAX_OBJ = 100; // Twitter API: Maximum number of objects per request


var TwigestAction = module.exports = function () {
	this.twigest = new Twit({
		consumer_key: credentials.twitter.consumerKey,
		consumer_secret: credentials.twitter.consumerSecret,
		app_only_auth: true
	});
};


/**
 * Fetch IDs of accounts which the user follows (friends).
 *
 * @param {context} a context object is used to circumvent strict argument order (e.g. able to provide a user & callback without count)
 * @param {context.user} screen_name for which to retrieve friends
 * @param {context.count} number of users to retrieve; defaults to max. 5000
 */

TwigestAction.prototype.getFriendIds = function (context) {

	this.twigest.get('friends/ids', { screen_name: context.user, count: context.count || MAX_ID }, function(err, data) {
		if (err) return console.error('Twitter API GET for friends/ids encountered error: ' + err);
		var ids = data.ids; // Array

		callbackAndReturn(context.callback, ids);
	});
};


/**
 * Fetch full user objects by retrieving IDs and then hydrating them with users/lookup
 */

TwigestAction.prototype.getFriendObjects = function (context) {
	var self = this;

	this.twigest.get('friends/ids', { screen_name: context.user, count: context.count || MAX_ID }, function(err, data) {
		if (err) return console.error('Twitter API GET for friends/ids encountered error: ' + err);
		var ids = data.ids; // Array

		/* TODO: Expand loop for consecutive calls until ID list has been depleted */
		var idBlock = [];
		for (var i = 0; i < MAX_OBJ; i++) { idBlock.push(ids[i]); }

		self.twigest.get('users/lookup', { user_id: idBlock }, function (err, data) {
			if (err) return console.error('Twitter API GET for users/lookup encountered error: ' + err);
			//console.log(data);
			callbackAndReturn(context.callback, data);
		});
	});
};

/**
 * Fetch verified friends ONLY
 */

TwigestAction.prototype.getVerifiedFriends = function (context) {
	/* NOTE: Call to getFriendObjects() is costly, consider rewrite */
	this.getFriendObjects({
		user: context.user,
		count: context.count,
		callback: function (friends) {
			var verifiedFriends = friends.filter(function (friend) { return friend.verified === true; });
			console.log(verifiedFriends);
			callbackAndReturn(context.callback, verifiedFriends);
		}
	});
};


/**
 * HELPERS
 */

// Check if a valid callback is present and return
function callbackAndReturn (callback, data) {
	if (callback && typeof callback === 'function') {
		console.log('Callback true');
		callback(data);
	}
	else if (callback && typeof callback !== 'function') {
		return console.error('Invoked callback is not a function.');
	}
	return data;
}
