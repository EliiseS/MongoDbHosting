var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var url = 'mongodb://localhost:27017/hosting';
var collections;

var dbConnect = function(res, dbQuery){
    MongoClient.connect(url, function(err, db) {
    if (err) {
        res.status(501);
        res.send({'msg': '501 Server Crashed'});
        console.log(err);
        return;
    }
        console.log("Connecting to server")
        collections = db.collection('collections');
        dbQuery();
})};


//VIEW COLLECTION(S)  ---------------------------------------------------------------------------------
app.get('/collections/:id', function(req, res) {
    var getAll = req.query.getAll;

    function dbQuery() {
    if (req.params.id.length === 12 || req.params.id.length === 24) {
            if (getAll) { //VIEW ALL COLLECTIONS FOR USER USING USER ID
                collections.find({'user_id': req.params.id}).toArray(function (err, data) {
                    if (err) {
                        res.status(400);
                        res.send({'msg': '400 Bad request'});
                        console.log(err);
                    }
                    if (data == null) {
                        res.status(404);
                        res.send({'msg': 'No collections found'});
                    }
                    else {
                        res.status(200);
                        res.send(data);
                    }
                });
            } else { //GET ONE COLLECTION USING COLLECTIONS ID
                collections.find({'_id': ObjectId(req.params.id)}).toArray(function (err, data) {
                    if (data == null) {
                        res.status(404);
                        res.send({'msg': 'No collections found'});
                    }
                    else {
                        res.status(200);
                        res.send(data);
                    }
                });
            }
        } else {
            res.status(400);
            res.send({'msg': '400 Bad Request'});
        }
    };

    dbConnect(res, dbQuery);
}); // END OF VIEW COLLECTION(S)

// ADD A NEW COLLECTION
app.post('/collections', function(req, res) {
<<<<<<< HEAD
    collections.insert(req.body,function(err) {
        if (err) {
            res.status(400);
            res.send({'msg' : '400 Bad Request'});
        } else {
            res.status(200);
            res.send({'msg' : '200 Successfull Operation'});
        }
    });
=======
    function dbQuery() {
        collections.insert(req.body, function (err) {
            if (err) {
                res.status(400);
                res.send({'msg': '400 Bad Request'});
            } else {
                res.status(200);
                res.send({'msg': '200 Successful Operation'});
            }
        });
    };
    dbConnect(res, dbQuery);
>>>>>>> 34c9c15214036d56d3845e3cabfa20981ec1c3f4
}); // END OF POST A NEW COLLECTION

// ADD A NEW ITEM INTO COLLECTION
app.post('/collections/:id', function(req, res) {
    function dbQuery() {
    collections.update({'_id': ObjectId(req.params.id)},{
     $push:{ Elements : {$each : req.body}}}, function (err) {
        if (err) {
            res.status(400);
            res.send({'msg' : '400 Bad Request'});
            return;
        }
        res.status(200);
        res.send({'msg': '200 Successful Operation'});
    });
    };
    dbConnect(res, dbQuery);
    
}); // END OF UPDATE AN EXISTING COLLECTION

// UPDATE AN EXISTING COLLECTION
app.put('/collections/:id', function(req, res) {



}); // END OF UPDATE AN EXISTING COLLECTION

//UPDATE COLLECTION
app.patch('/collections/:id', function(req, res) {
    var updateAll = req.query.updateAll;
    var updateOne = req.query.updateOne;
    
    //UPDATE WHOLE 'Elements array'
    function dbQuery() {
        if (updateAll) {
            var collectionForUpdate = req.body;
            console.log(collectionForUpdate);
            collections.update({'_id': ObjectId(req.params.id)}, {
                $set: {"Elements": collectionForUpdate}
            }, function (err) {
                if (err) {
                    console.log(err);
                    return;
                }
                res.status(200);
                res.send({'msg': '200 Successfully Created'});
            });
        }
        //UPDATE ONE ITem
        if (updateOne) {

            collections.update({'_id': ObjectId(req.params.id), Elements: req.body.originalItem}, {
                $set: {"Elements.$": req.body.updatedItem}
            }, function (err) {
                if (err) {
                    console.log(err);
                    res.status(400);
                    res.send({'msg': '400 Bad Request'});
                }
                res.status(200);
                res.send({'msg': '200 Successfully Created'});
            });
        }
    };
    dbConnect(res, dbQuery);
}); // END OF UPDATE AN EXISTING COLLECTION



//DELETE ALL COLLECTIONS FOR USER OR ONE COLLECTION  ---------------------------------------------------------------------------------
app.delete('/collections/:id', function(req, res) {
    //noinspection JSUnresolvedVariable
    var deleteAll = req.query.deleteAll;
    var deleteOne = req.query.deleteOne;
    function dbQuery() {
        if (req.params.id.length === 12 || req.params.id.length === 24) {
            //DELETE ALL ELEMENTS FROM COLLECTION
            if (deleteAll) {
                collections.remove({'user_id': req.params.id}, function (err) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    res.status(200);
                    res.send({'msg': '200 Successful Operation'});

                });
            }
            //DELETE ONE ELEMENT FROM COLLECTION
            if (deleteOne) {
                collections.update({'_id': ObjectId(req.params.id)}, {
                    $pull: {Elements: req.body}
                }, function (err) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    res.status(200);
                    res.send({'msg': 'Element deleted from array'});
                });
            }
            //DELETE COLLECTION ITSELF
            if (!deleteAll && !deleteOne) {
                collections.remove({'_id': ObjectId(req.params.id)}, function (err) {
                    if (err) {
                        res.status(400);
                        res.send({'msg': '400 Bad request'});
                        console.log(err);
                        return;
                    }
                    res.status(200);
                    res.send({'msg': 'Collections removed'});
                });
            }
        } else {
            res.status(400);
            res.send({'msg': '400 Bad Request'});
        }
    };
    dbConnect(res, dbQuery);

}); // END OF DELETE ALL COLLECTIONS FOR USER OR ONE COLLECTION


module.exports = app;