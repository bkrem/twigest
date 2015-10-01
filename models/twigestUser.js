var mongoose = require('mongoose');

var twigestUserSchema = mongoose.Schema({
    user: {
        userhandle: { type: String, required: true, unique: true, dropDups: true }
    },
    trackedUsers: {
        twitterId: { type: Number, sparse: true, required: false, unique: true, dropDups: true },
        handle: String,
        name: { type: String, required: false },
        description: String, // TODO: Find solution for empty descriptions when required:true
        verified: { type: Boolean, required: false },
        topicTags: [String]
    }
});

var twigestUser = mongoose.model('twigestUser', twigestUserSchema);
module.exports = twigestUser;
