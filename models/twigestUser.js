var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    twitterId: { type: Number, required: true, unique: true, dropDups: true },
    handle: String,
    name: { type: String, required: true },
    bio: String,
    verified: Boolean,
    topicTags: [String],
    trackIds: [Number]
});

var User = mongoose.model('User', userSchema);
module.exports = User;
