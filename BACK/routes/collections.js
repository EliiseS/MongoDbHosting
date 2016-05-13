var express = require('express');
var app = express();

var ObjectId = require('mongodb').ObjectId;

var db = require('../db');
var collections = db.get().collection('collections');

//VIEW COLLECTION(S)  ---------------------------------------------------------------------------------
app.get('/collections/:id', function(req, res) {
    var getAll = req.query.getAll;
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

            });
        }

    } else {
        res.status(400);
        res.send({'msg': '400 Bad Request'});
    }

}); // END OF VIEW COLLECTION(S)



//VIEW COLLECTION(S)  ---------------------------------------------------------------------------------
app.get('/collections/:id', function(req, res) {
    var getAll = req.query.getAll;

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

            });
        }

    } else {
        res.status(400);
        res.send({'msg': '400 Bad Request'});
    }

}); // END OF VIEW COLLECTION(S)

// ADD A NEW COLLECTION
app.post('/collections', function(req, res) {
    collections.insert(req.body, function (err) {
        if (err) {
            res.status(400);
            res.send({'msg': '400 Bad Request'});
        }
        else {
            res.status(200);
            res.send({'msg': '200 Successful Operation'});
        }
    });

}); // END OF POST A NEW COLLECTION

// ADD A NEW ITEM INTO COLLECTION USING COLLECTIONS ID
app.post('/collections/:id', function(req, res) {

    if (req.params.id.length === 12 || req.params.id.length === 24) {
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
        });
    }else {
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
            });
        }

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
            });
        }
    }
    else {
        res.status(400);
        res.send({'msg': '400 Bad Request'});
    }
}); // END OF DELETE ALL COLLECTIONS FOR USER OR ONE COLLECTION

module.exports = app;