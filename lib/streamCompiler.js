var twigest = require('./twigest');
var dbOps = require('./dbOps');

var streamCompiler = module.exports = {

    getStreams: function (twigestUser) {
        var twitterIds = [];

        dbOps.findTrackedUsers(twigestUser, function (data) {
            data.map(function (user) { twitterIds.push(user.twitterId); });
        });
    }

};
