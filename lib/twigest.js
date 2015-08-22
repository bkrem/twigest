/*jshint laxcomma:true, node: true*/
var Twit = require('twit');
var credentials = require('../credentials');
var NodeCache = require('node-cache');
var twigestCache = new NodeCache();

/**
 * CONSTANTS
 */
var MAX_ID = 5000; // Twitter API: Maximum number of IDs per request
var MAX_OBJ = 100; // Twitter API: Maximum number of user objects per request


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
	var self = this, ids;

	twigestCache.get('sessionIds', function (err, val) {
		if (err) return console.error('twigestCache GET sessionIds failed: ' + err);
		if (val !== undefined) {
			console.log('sessionIds is set in cache!');
			ids = val.ids;
			console.log(ids);
			callbackAndReturn(context.callback, ids);
		} else {
			console.log('sessionIds not set in cache, retrieving...');
			self.twigest.get('friends/ids', { screen_name: context.userhandle, count: context.count || MAX_ID }, function (err, data) {
				if (err) return console.error('Twitter API GET for friends/ids encountered error: ' + err);
				setTwigestCache('sessionIds', data);
				ids = data.ids; // Array
				console.log(ids);
				callbackAndReturn(context.callback, ids);
			});
		}
	});

};


/**
 * Fetch full user objects by retrieving IDs and then hydrating them with users/lookup
 */

TwigestAction.prototype.getFriendObjects = function (context) {
	var self = this, ids;

	// Split the returned IDs into blocks of max. 100 for Twitter API users/lookup
	function splitAndLookup(ids) {
		/* TODO: Expand loop for consecutive calls until ID list has been depleted */
		var idBlock = [];
		for (var i = 0; i < MAX_OBJ; i++) { idBlock.push(ids[i]); }

		// TODO: Add twigestCache check for users/lookup
		self.twigest.get('users/lookup', { user_id: idBlock, include_entities: false }, function (err, data) {
			if (err) return console.error('Twitter API GET for users/lookup encountered error: ' + err);
			console.log(data);
			callbackAndReturn(context.callback, data);
		});
	}

	// Check if IDs for this instance are stored in cache, retrieve through Twitter API if not
	twigestCache.get('sessionIds', function (err, val) {
		if (err) return console.error('twigestCache GET sessionIds failed: ' + err);
		if (val !== undefined) {
			console.log('sessionIds is set in cache!');
			ids = val.ids; // Array
			console.log(ids);
			splitAndLookup(ids);
		} else {
			console.log('sessionIds not set in cache, retrieving...');
			self.twigest.get('friends/ids', { screen_name: context.userhandle, count: context.count || MAX_ID }, function (err, data) {
				if (err) return console.error('Twitter API GET for friends/ids encountered error: ' + err);

				setTwigestCache('sessionIds', data);
				ids = data.ids; // Array
				console.log(ids);
				splitAndLookup(ids);
			});
		}
	});
};

/**
 * Fetch verified friends ONLY
 */

TwigestAction.prototype.getVerifiedFriends = function (context) {
	/* NOTE: Call to getFriendObjects() is costly, consider rewrite */
	this.getFriendObjects({
		user: context.userhandle,
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


/**
 * CACHE OPERATIONS
 */

 function setTwigestCache(cache, data) {
	 twigestCache.set(cache, data, function (err, success) {
		 if (err) return console.error('twigestCache SET ' + cache + ' failed: ' + err);
		 console.log('twigestCache created key for ' + cache + ': ' + success);
	 });
 }
