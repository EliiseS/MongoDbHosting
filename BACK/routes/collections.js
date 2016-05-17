var express = require('express');
var app = express();

var ObjectId = require('mongodb').ObjectId;

var db = require('../db');
var dbCollections = db.get().collection('collections');
var modCollections = require('../models/collections')


//VIEW COLLECTION(S)  ---------------------------------------------------------------------------------
app.get('/collections/:id', function(req, res) {
    var getAll = req.query.getAll;
    if (req.params.id.length === 12 || req.params.id.length === 24) {
        //VIEW ALL COLLECTIONS FOR USER USING USER ID
        if (getAll) { 
            modCollections.getAll(req.params.id, function (err, data) {
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
        //GET ONE COLLECTION USING COLLECTIONS ID   
        } else {
            modCollections.getOne(req.params.id, function (err, data) {
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
    modCollections.addNewCol(req.body, function (err) {
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
        modCollections.addNewItem(req.params.id, req.body, function (err) {
            if (err) {
                res.status(400);
                res.send({'msg': 'ERROR: 400 Bad Request'});
                console.log(err);
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
app.put('/collections/:id', function(req, res) {
    var updateAll = req.query.updateAll;
    var updateOne = req.query.updateOne;

    if (req.params.id.length === 12 || req.params.id.length === 24) {
        //UPDATE WHOLE 'Elements' ARRAY
        if (updateAll) {
            modCollections.updateArrayAll(req.params.id, req.body, function (err) {
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
            modCollections.updateArrayOne(req.params.id, req.body, function (err) {
            }, function (err) {
                if (err) {
                    console.log(err);
                    res.status(400);
                    res.send({'msg': '400 Bad Request'});
                }
                else {
                    res.status(200);
                    res.send({'msg': '200 One Item Updated in "Elements" array'});
                }
            });

        }

    }else {
        res.status(400);
        res.send({'msg': '400 Bad Request'});
    }

}); // END OF UPDATE AN EXISTING COLLECTION

//DELETE ALL COLLECTIONS FOR USER OR ONE COLLECTION  ---------------------------------------------------------------------------------
app.patch('/collections/:id', function(req, res) {
    //noinspection JSUnresolvedVariable
    var deleteOne = req.query.deleteOne;
    var deleteAll = req.query.deleteAll;

    if (req.params.id.length === 12 || req.params.id.length === 24) {

        //DELETE ONE ELEMENT FROM COLLECTION
        if (deleteOne) {
            modCollections.deleteOne(req.params.id, req.body, function (err) {
                if (err) {
                    res.status(400);
                    res.send({'msg': '400 Bad request'});
                    console.log(err);
                }
                else {
                    res.status(200);
                    res.send({'msg': '200 Item deleted'});
                    console.log("item removed");
                }
                db.close();
            });
        }
        //DELETE ALL ELEMENTS FROM COLLECTION
        if (deleteAll) {
            modCollections.deleteAll(req.params.id, function (err) {
                if (err) {
                    console.log(err);
                    return;
                }
                res.status(200);
                res.send({'msg': '200 Successful Operation'});

            });
        }
    } else {
        res.status(400);
        res.send({'msg': '400 Bad Request'});
    }

}); // END OF UPDATE AN EXISTING COLLECTION

module.exports = app;