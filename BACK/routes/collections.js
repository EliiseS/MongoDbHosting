var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var url = 'mongodb://localhost:27017/hosting';
var collections;

var dbConnect = function(res, dbQuery) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            res.status(501);
            res.send({'msg': '501 Server Crashed'});
            console.log(err);
            return;
        }
        collections = db.collection('collections');
        dbQuery(db);
    });
};

//VIEW COLLECTION(S)  ---------------------------------------------------------------------------------
app.get('/collections/:id', function(req, res) {
    var getAll = req.query.getAll;

    if (req.params.id.length === 12 || req.params.id.length === 24) {
        function dbQuery(db) {

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

                    db.close();
                });
            } else { //GET ONE COLLECTION USING COLLECTIONS ID
                collections.find({'_id': ObjectId(req.params.id)}).toArray(function (err, data) {
                    if (err) {
                        res.status(400);
                        res.send({'msg': '400 Bad request'});
                        console.log(err);
                    }
                    else if (data == null) {
                        res.status(404);
                        res.send({'msg': 'No collections found'});
                    }
                    else {
                        res.status(200);
                        res.send(data);
                    }

                    db.close();
                });
            }
        }

        dbConnect(res, dbQuery);
    } else {
        res.status(400);
        res.send({'msg': '400 Bad Request'});
    }

}); // END OF VIEW COLLECTION(S)

// ADD A NEW COLLECTION
app.post('/collections', function(req, res) {

    function dbQuery(db) {
        collections.insert(req.body, function (err) {
            if (err) {
                res.status(400);
                res.send({'msg': '400 Bad Request'});
            }
            else {
                res.status(200);
                res.send({'msg': '200 Successful Operation'});
            }
            db.close();
        });
    }
    dbConnect(res, dbQuery);
}); // END OF POST A NEW COLLECTION

// ADD A NEW ITEM INTO COLLECTION USING COLLECTIONS ID
app.post('/collections/:id', function(req, res) {

    if (req.params.id.length === 12 || req.params.id.length === 24) {
        function dbQuery(db) {
            collections.update({'_id': ObjectId(req.params.id)}, {
                $push: {Elements: {$each: req.body}}
            }, function (err) {
                if (err) {
                    res.status(400);
                    res.send({'msg': '400 Bad Request'});
                }
                else {
                    res.status(200);
                    res.send({'msg': '200 New item added to "Elements" Array'});
                }
                db.close();
            });
        }
        dbConnect(res, dbQuery);
    } else {
        res.status(400);
        res.send({'msg': '400 Bad Request'});
    }
    
}); // END OF UPDATE AN EXISTING COLLECTION

//UPDATE COLLECTION USING COLLECTION ID
app.patch('/collections/:id', function(req, res) {
    //noinspection JSUnresolvedVariable
    var updateAll = req.query.updateAll;
    var updateOne = req.query.updateOne;

    if (req.params.id.length === 12 || req.params.id.length === 24) {
        //UPDATE WHOLE 'Elements array'
        function dbQuery(db) {
            if (updateAll) {
                var collectionForUpdate = req.body;
                console.log(collectionForUpdate);
                collections.update({'_id': ObjectId(req.params.id)}, {
                    $set: {"Elements": collectionForUpdate}
                }, function (err) {
                    if (err) {
                        res.status(400);
                        res.send({'msg': '400 Bad Request'});
                        console.log(err);
                    }
                    else {
                        res.status(200);
                        res.send({'msg': '200 All Items Updated in "Elements" array'});
                    }
                    db.close();
                });
            }
            //UPDATE ONE ELEMENT
            if (updateOne) {
                collections.update({'_id': ObjectId(req.params.id), Elements: req.body.originalItem}, {
                    $set: {"Elements.$": req.body.updatedItem}
                }, function (err) {
                    if (err) {
                        console.log(err);
                        res.status(400);
                        res.send({'msg': '400 Bad Request'});
                    }
                    else {
                        res.status(200);
                        res.send({'msg': '200 Item Updated'});
                    }
                    db.close();
                });
            }
        }
        dbConnect(res, dbQuery);
    }else {
        res.status(400);
        res.send({'msg': '400 Bad Request'});
    }

}); // END OF UPDATE AN EXISTING COLLECTION

//DELETE ALL COLLECTIONS FOR USER OR ONE COLLECTION  ---------------------------------------------------------------------------------
app.delete('/collections/:id', function(req, res) {
    //noinspection JSUnresolvedVariable
    var deleteAll = req.query.deleteAll;
    var deleteOne = req.query.deleteOne;

    if (req.params.id.length === 12 || req.params.id.length === 24) {
        function dbQuery(db) {
            //DELETE ALL ELEMENTS FROM COLLECTION
            if (deleteAll) {
                console.log("Trying to remove ALL");
                collections.remove({'user_id': req.params.id}, function (err) {
                    if (err) {
                        res.status(400);
                        res.send({'msg': '400 Bad Request'});
                        console.log(err);
                    }
                    else {
                        res.status(200);
                        res.send({'msg': '200 All Items Deleted'});
                    }
                    db.close();
                });
            }
            //DELETE ONE ELEMENT FROM COLLECTION
            if (deleteOne) {
                console.log("Trying to remove one");
                console.log(req.body);
                collections.update({'_id': ObjectId(req.params.id)}, {
                    $pull: {Elements: req.body}
                }, function (err) {
                    if (err) {
                        res.status(400);
                        res.send({'msg': '400 Bad request'});
                        console.log(err);
                    }
                    else {
                        res.status(200);
                        res.send({'msg': '200 Item deleted'});
                    }
                    db.close();
                });
            }
            //DELETE COLLECTION ITSELF
            if (!deleteAll && !deleteOne) {
                console.log("REMOVE WHOLE COLLECTION!");
                collections.remove({'_id': ObjectId(req.params.id)}, function (err) {
                    if (err) {
                        res.status(400);
                        res.send({'msg': '400 Bad request'});
                        console.log(err);
                    }
                    else {
                        res.status(200);
                        res.send({'msg': 'Collections removed'});
                    }
                    db.close();
                });
            }
        }
        dbConnect(res, dbQuery);
    }
     else {
        res.status(400);
        res.send({'msg': '400 Bad Request'});
    }
}); // END OF DELETE ALL COLLECTIONS FOR USER OR ONE COLLECTION


module.exports = app;