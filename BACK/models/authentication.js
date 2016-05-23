var db = require('../db');

var ObjectId = require('mongodb').ObjectId;

var dbUsers = db.get().collection('Users');

//GET ALL COLLECTIONS FOR USER USING USER ID
exports.addUser = function(body, cb) {

    dbUsers.insert(body,function(err, result) {
        if (err) return cb(err);
        cb(null, result);
    });
};// END OF VIEW COLLECTION(S)