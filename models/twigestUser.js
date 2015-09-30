var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    twitterId: { type: Number, required: true, unique: true, dropDups: true },
    handle: String,
    name: { type: String, required: true },
    description: String, // TODO: Find solution for empty descriptions when required:true
    verified: { type: Boolean, required: true },
    topicTags: [String]
});

var User = mongoose.model('User', userSchema);
module.exports = User;
