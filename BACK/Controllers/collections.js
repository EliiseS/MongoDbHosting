var db = require('../db');

var ObjectId = require('mongodb').ObjectId;

var collection = db.get().collection('collection');


exports.getAllCol = function(cb) {


    collection.find().toArray(function(err, docs) {
        cb(err, docs)
    })
}