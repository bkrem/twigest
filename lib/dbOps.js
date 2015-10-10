/*jshint laxcomma:true, node: true*/
var keywords = require('./filterKeywords'),
    TrackedUser = require('../models/trackedUser');

var dbOps = module.exports = {

    trackUser: function (req) {
        var q = req.query;
        // TODO: Functional rewrite of checkTags()
        var checkTags = function () {
            var topicTags = []
            ,	desc = q.description;
            for (var topic in keywords) {
                for (var i = 0; i < keywords[topic].length; i++) {
                    if (desc.toLowerCase().indexOf(keywords[topic][i]) !== -1) topicTags.push(topic);
                }
            }
            return topicTags;
        };

        // Initialize a new TrackedUser schema object
        var newUser = new TrackedUser({
                twitterId: q.twitterId,
                name: q.name,
                handle: q.handle,
                description: q.description,
                verified: q.verified,
                topicTags: checkTags(),
                trackedBy: q.userhandle,
                statuses_count: q.statuses_count,
                followers_count: q.followers_count,
                friends_count: q.friends_count
        });

        // Check whether the profile to-be-tracked is present in "trackedUsers" collection
        TrackedUser.find( { twitterId: q.twitterId }, function (err, user) {
            if (err) throw new Error("Error at initial .find twitterId: " + err);
            // If returned array is empty => create new trackedUser document
            if (user.length === 0) {
                console.log("twitterId " + q.twitterId + " is not present in DB. Adding...");
                newUser.save(function (err, user) {
                    if (err) console.error('Error at MongoDB .save(): ' + err);
                    return console.log('Added ' + user.name + ' to DB successfully!');
                });
                // Otherwise, update the existing doc's "trackedBy" prop by adding
                // current Twigest user wishing to track this profile.
            } else {
                console.log('User is present in DB: ' + user);
                TrackedUser.update({ twitterId: q.twitterId }, { $addToSet: { trackedBy: q.userhandle } }, function (err, u) {
                    if (err) console.error(err);
                    return console.log(u);
                });
            }
        });
    }

};
