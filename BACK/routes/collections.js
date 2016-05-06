var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectId;
var url = 'mongodb://localhost:27017/hosting';
var BodyParser = require('body-parser'); // middle

// Import events module
var events = require('events');
// Create an eventEmitter object
var eventEmitter = new events.EventEmitter();

MongoClient.connect(url, function(err, db) {
    if (err) {
        res.status(500);
        res.send({'msg': 'Server crashed'});
        return;
    }
    collection = db.collection('collections');
});


//VIEW ALL COLLECTIONS  ---------------------------------------------------------------------------------
app.get('/collections/:id', function(req, res) {
    if(req.params.id.length === 12 || req.params.id.length === 24){
        collection.find({'userID': req.params.id},function(err, data) {
            if (data==null){
                res.status(404);
                res.send({'msg': 'No collections found'});
            }
            else{
                res.send(data);
            }
        });
    }  else{
        res.status(400);
        res.send({'msg' : '400 Bad Request'});
    }


}); // END OF VIEW ALL COLLECTIONS
module.exports = app;