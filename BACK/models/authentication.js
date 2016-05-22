var db = require('../db');

var ObjectId = require('mongodb').ObjectId;

var dbUsers = db.get().collection('Users');

//GET ALL COLLECTIONS FOR USER USING USER ID
exports.resgiterUser = function(id, cb) {

    dbCollections.find({'user_id': id}).toArray(function (err, data) {
        if (err) return cb(err);
        if (data.length === 0) return cb();
        cb(null, data);
    });
};// END OF VIEW COLLECTION(S)