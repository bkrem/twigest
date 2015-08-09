var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    twitterId: Number,
    handle: String,
    name: String,
    bio: String,
    verified: Boolean,
    topicTags: [String],
    trackIds: [Number]
});

var User = mongoose.model('User', userSchema);
module.exports = User;
