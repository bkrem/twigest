var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    _id: Number,
    twitterId: Number,
    handle: String,
    name: String,
    bio: String,
    verified: Boolean,
    topicTags: [String],
    trackIds: [Number]
});

var User = mongoose.model('twigestUser', userSchema);
module.exports = User;
