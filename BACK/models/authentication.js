var db = require('../db');

var ObjectId = require('mongodb').ObjectId;

var dbUsers = db.get().collection('Users');

//ADD NEW USER TO THE DATABASE
exports.addUser = function(body, cb) {

    dbUsers.insert(body,function(err, result) {
        if (err) return cb(err);
        cb(null, result);
    });
};// END OF ADD NEW USER TO THE DATABASE

//FIND EMAIL
exports.findEmail = function(email, cb) {

    dbUsers.find({'email':email}).toArray(function(err, data) {
        if (err) return cb(err);
        if (data.length === 0) return cb();
        cb(null, data);
    });
};// END OF VIEW COLLECTION(S)