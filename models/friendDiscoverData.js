var mongoose = require('mongoose');

var friendDiscoverDataSchema = mongoose.Schema({
    created_at: { type: Date },
    updated_at: { type: Date },
    handle: String,
    friends: {} // TODO replace object depending on timeout
});

friendDiscoverDataSchema.pre('save', function(next){
    var now = new Date();
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
});

friendDiscoverDataSchema.pre('update', function (next) {
    var now = new Date();
    this.updated_at = now;
    next();
});

var friendDiscoverData = mongoose.model('friendDiscoverData', friendDiscoverDataSchema);
module.exports = friendDiscoverData;
