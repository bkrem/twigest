var mongoose = require('mongoose');

var twigestUserSchema = mongoose.Schema({
    // TODO: Expand user object
    user: {
        handle: String
    },
    trackedUsers: {
        twitterId: { type: Number, required: true, unique: true, dropDups: true },
        handle: String,
        name: { type: String, required: true },
        description: String, // TODO: Find solution for empty descriptions when required:true
        verified: { type: Boolean, required: true },
        topicTags: [String]
    }
});

var twigestUser = mongoose.model('twigestUser', twigestUserSchema);
module.exports = twigestUser;
