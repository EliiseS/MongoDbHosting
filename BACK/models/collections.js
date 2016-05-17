var db = require('../db');

var ObjectId = require('mongodb').ObjectId;

var dbCollections = db.get().collection('collections');


//GET ALL COLLECTIONS FOR USER USING USER ID
exports.getAll = function(id, cb) {

    dbCollections.find({'user_id': id}).toArray(function (err, data) {
        if (err) return cb(err);
        console.log(data);
        if (data.length === 0) return cb()
        cb(null, data);
    });
};// END OF VIEW COLLECTION(S)

//GET ONE COLLECTION USING COLLECTIONS ID 
exports.getOne = function(id, cb) {
    
    dbCollections.find({'_id': ObjectId(id)}).toArray(function (err, data) {
        if (err) return cb(err);
        console.log(data);
        if (data.length === 0) return cb()
        cb(null, data);
    });
};// END OF VIEW COLLECTION(S)

// ADD A NEW COLLECTION
exports.addNewCol = function(body, cb) {

    dbCollections.insert(body, function (err) {
        if (err) return cb(err);
        cb();
    });
}; // END OF POST A NEW COLLECTION


// ADD A NEW ITEM(S) INTO EXISTING COLLECTION USING COLLECTIONS ID
exports.addNewItem = function(id, body, cb) {
    // JSON Syntax for body -- $each -> has to be an array
    //  [ {"Dog3":"MOP"}]
    dbCollections.update({'_id': ObjectId(id)}, {
        $push: {Elements: {$each: body}}
    }, function (err) {
        if (err) return cb(err);
        cb();
    });
}; // END OF ADD NEW ITEM(S) INTO AN EXISTING COLLECTION

//UPDATE WHOLE 'Elements array'
exports.updateArrayAll = function(id, body, cb) {

    dbCollections.update({'_id': ObjectId(id)}, {
        $set: {Elements: body}
    }, function (err) {
        if (err) return cb(err);
        cb();
    });
}; // END OF UPDATE WHOLE 'Elements' ARRAY

//UPDATE ONE ELEMENT IN 'Elements' ARRAY
exports.updateArrayOne = function(id, body, cb) {

    dbCollections.update({'_id': ObjectId(id), Elements:  body.originalItem}, {
        $set: {"Elements.$": body.updatedItem}
    }, function (err) {
        if (err) return cb(err);
        cb();
    });
}; // END OF UPDATE ONE ELEMENT IN 'Elements' ARRAY

//DELETE ONE ELEMENT FROM COLLECTION
exports.deleteOne = function(id, body, cb) {

    dbCollections.update({'_id': ObjectId(id)}, {
        $pull: {Elements: body}
    }, function (err) {
        if (err) return cb(err);
        cb();
    });
}; // END OF //DELETE ONE ELEMENT FROM COLLECTION

//DELETE ALL ELEMENTS FROM COLLECTION
exports.deleteAll = function(id, cb) {

    collections.remove({'user_id': id}, function (err) {
        if (err) return cb(err);
        cb();
    });
}; // END OF //DELETE ALL ELEMENTS FROM COLLECTION



