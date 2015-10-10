var mongoose = require('mongoose');

var trackedUserSchema = mongoose.Schema({
    twitterId: { type: Number, sparse: true, required: false, unique: true, dropDups: true },
    handle: String,
    name: { type: String, required: false },
    description: String, // TODO: Find solution for empty descriptions when required:true
    verified: { type: Boolean, required: false },
    statuses_count: Number,
    followers_count: Number,
    friends_count: Number,
    topicTags: [String],
    trackedBy: [String]
});

var trackedUser = mongoose.model('trackedUser', trackedUserSchema);
module.exports = trackedUser;
