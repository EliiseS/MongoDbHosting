var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectId;
var url = 'mongodb://localhost:27017/hosting';
var BodyParser = require('body-parser'); // middle
var collections;
var ObjectId = require('mongodb').ObjectId;

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
    collections = db.collection('collections');
});


//VIEW ALL COLLECTIONS FOR USER  ---------------------------------------------------------------------------------
app.get('/collections/:id', function(req, res) {
    if(req.params.id.length === 12 || req.params.id.length === 24){
        collections.find({'user_id': req.params.id}).toArray(function(err, data) {
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

}); // END OF VIEW ALL COLLECTIONS FOR USER

// POST A NEW COLLECTION
app.post('/collections', function(req, res) {
    collections.insert(req.body,function(err, data) {
        if (err) {
            console.log(err);
        } else {
            res.status(404);
            res.send({'msg': 'Collections created'});
        }
    });
}); // END OF POST A NEW COLLECTION

// UPDATE AN EXISTING COLLECTION
app.put('/collections/:id', function(req, res) {
    collections.update({'_id': ObjectId(req.params.id)},{
        $set:req.body
    },function(err, data) {
        res.send({'msg': 'User updated'});
    });
}); // END OF UPDATE AN EXISTING COLLECTION

/* NOT IMPLEMENTED UPDATE METHOD
app.update('/collections/:id', function(req, res) {


    collections.update({'_id': ObjectId(req.params.id)},{
        $pull:req.body
    },function(err, data) {
        res.send({'msg': 'User updated'});
    });
}); // END OF UPDATE AN EXISTING COLLECTION
*/



//DELETE ALL COLLECTIONS FOR USER OR ONE COLLECTION  ---------------------------------------------------------------------------------
app.delete('/collections/:id', function(req, res) {
    var deleteAll = req.query.deleteAll;

    if(req.params.id.length === 12 || req.params.id.length === 24) {
        if (deleteAll) {
            collections.remove({'user_id': req.params.id}, function (err, data) {
                res.send({'msg': 'ALL COLLECTIONS REMOVED FOR USER'});
            });
        } else {
            collections.remove({'_id': ObjectId(req.params.id)}, function (err, data) {

                res.send({'msg': 'Collections removed'});
            });
        }
    } else {
        res.status(400);
        res.send({'msg' : '400 Bad Request'});
    }

}); // END OF DELETE ALL COLLECTIONS FOR USER OR ONE COLLECTION



module.exports = app;