var db = require('../db');

var ObjectId = require('mongodb').ObjectId;

var dbUsers = db.get().collection('users');

//ADD NEW USER TO THE DATABASE
exports.addUser = function(body, cb) {
    var definedBody =  {
        email : body.email,
        name : body.name,
        password : body.password
    };

    dbUsers.insert(definedBody,function(err, result) {
        if (err) return cb(err);
        cb(null, result);
    });
};// END OF ADD NEW USER TO THE DATABASE

//GET USER
exports.getUser = function(email, cb) {

    dbUsers.find({'email':email}).toArray(function(err, data) {
        if (err) return cb(err);
        if (data.length === 0) return cb();
        cb(null, data);
    });
};// END OF VIEW COLLECTION(S)



exports.updatePass = function(email, pass, cb) {

    dbUsers.update({"email": email},{
        $set:{"password":pass}
    },function(err, result) {
        if (err) return cb(err);
        cb(null, result);
    });
};// END OF VIEW COLLECTION(S)


exports.updateEmail = function(email, id, cb) {

    dbUsers.update({'_id':ObjectId(id)},{
        $set:{"email": email}
    },function(err, result) {
        if (err) return cb(err);
        cb(null, result);
    });
};// END OF VIEW COLLECTION(S)