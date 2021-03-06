var db = require('../db');

var ObjectId = require('mongodb').ObjectId;

var dbCollections = db.get().collection('collections');


//GET ALL COLLECTIONS FOR USER USING USER ID
exports.getAll = function(id, cb) {

    dbCollections.find({'user_id': id}).toArray(function (err, data) {
        if (err) return cb(err);
        if (data.length === 0) return cb();
        cb(null, data);
    });
};// END OF VIEW COLLECTION(S)

//GET ALL COLLECTIONS FOR USER USING USER ID
exports.getAllCollections = function(cb) {

    dbCollections.find().toArray(function (err, data) {
        if (err) return cb(err);
        if (data.length === 0) return cb();
        cb(null, data);
    });
};// END OF VIEW COLLECTION(S)


//GET ONE COLLECTION USING COLLECTIONS ID 
exports.getOne = function(id, cb) {
    
    dbCollections.find({'_id': ObjectId(id)}).toArray(function (err, data) {
        if (err) return cb(err);
        if (data.length === 0) return cb();
        cb(null, data);
    });
};// END OF VIEW COLLECTION(S)

// ADD A NEW COLLECTION
exports.addNewCol = function(body, cb) {

   definedBody =  {
       user_id : body.user_id,
       name : body.name,
       Elements : body.Elements
   };

    dbCollections.insert(definedBody, function (err, result) {
        if (err) return cb(err);
        cb(null, result);
    });
}; // END OF POST A NEW COLLECTION


// ADD A NEW ITEM(S) INTO EXISTING COLLECTION USING COLLECTIONS ID
exports.addNewItem = function(id, body, cb) {
    // JSON Syntax for body -- $each -> has to be an array
    //  [ {"Dog3":"MOP"}]
    dbCollections.update({'_id': ObjectId(id)}, {
        $push: {Elements: {$each: body}}
    }, function (err, result) {
        if (err) return cb(err);
        cb(null, result);
    });
}; // END OF ADD NEW ITEM(S) INTO AN EXISTING COLLECTION

//UPDATE THE NAME OF THE COLLECTION
exports.updateColName = function(id, body, cb) {
    //{"name": "Muffinssssssssssssss"}

    dbCollections.update({'_id': ObjectId(id)}, {
        $set: {"name": body.name}
    }, function (err, result) {
        if (err) return cb(err);
        cb(null, result);
    });
}; // END OF UPDATE THE NAME OF THE COLLECTION

//UPDATE WHOLE 'Elements array'
exports.updateAll = function(id, body, cb) {

    dbCollections.update({'_id': ObjectId(id)}, {
        $set: {Elements: body}
    }, function (err, result) {
        if (err) return cb(err);
        cb(null, result);
    });
}; // END OF UPDATE WHOLE 'Elements' ARRAY


//UPDATE ONE ELEMENT IN 'Elements' ARRAY
exports.updateOne = function(id, body, cb) {
    /* JSON Syntax for body --
    {
    "originalItem": {
        "Dog3": "MOPP"
    },
    "updatedItem": {
        "Dog3": "Mupperts"
    }
    }
    */
    dbCollections.update({'_id': ObjectId(id), Elements:  body.originalItem}, {
        $set: {"Elements.$": body.updatedItem}
    }, function (err, result) {
        if (err) return cb(err);
        cb(null, result);
    });
}; // END OF UPDATE ONE ELEMENT IN 'Elements' ARRAY

//!!! DELETE ALL COLLECTIONS FOR USER !!!---------
exports.deleteAllCol = function(id, cb) {

    dbCollections.remove({'user_id': id}, function (err, result) {
        if (err) return cb(err);
        cb(null, result);
    });
}; // END OF DELETE ALL COLLECTIONS FOR USER

//DELETE COLLECTION USING COLLECTION ID
exports.deleteCol = function(id, cb) {

    dbCollections.remove({'_id': ObjectId(id)}, function (err, result) {
        if (err) return cb(err);
        cb(null, result);
    });
}; // END OF DELETE COLLECTION USING COLLECTION ID

//DELETE ALL ELEMENTS IN THE 'Elements' ARRAY FROM SPECIFIED COLLECTION
exports.deleteAll = function(id, cb) {

    dbCollections.update({'_id': ObjectId(id)}, {
        $set: {Elements: []}
    }, function (err, result) {
        if (err) return cb(err);
        cb(null, result);
    });
}; // END OF DELETE ALL ELEMENTS IN THE 'Elements' ARRAY FROM SPECIFIED COLLECTION


//DELETE ONE ELEMENT FROM COLLECTION
exports.deleteOne = function(id, body, cb) {
    /* JSON Syntax for body --
     {
     "Dog3": "MOPP"
     }
     */

    dbCollections.update({'_id': ObjectId(id)}, {
        $pull: {Elements: body}},
        function (err, result) {
        if (err) return cb(err);
        cb(null, result);
    });
}; // END OF DELETE ONE ELEMENT FROM COLLECTION



