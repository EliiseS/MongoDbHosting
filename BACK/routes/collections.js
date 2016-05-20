var express = require('express');
var app = express();

var collectionsModel = require('../models/collections')


//VIEW COLLECTION(S)  ---------------------------------------------------------------------------------
app.get('/collections/:id', function(req, res) {
    var getAll = req.query.getAll;
    if (req.params.id.length === 12 || req.params.id.length === 24) {
        //VIEW ALL COLLECTIONS FOR USER USING USER ID
        if (getAll) {
            collectionsModel.getAll(req.params.id, function (err, data) {
                if (err) {
                    res.status(400);
                    res.send({'msg': '400 Bad request'});
                    console.log(err);
                    return;
                }
                if (data == null) {
                    res.status(404);
                    res.send({'msg': 'No collections found'});
                    return;
                }
                    res.status(200);
                    res.send(data);
            });
            //GET ONE COLLECTION USING COLLECTIONS ID
        } else {
            collectionsModel.getOne(req.params.id, function (err, data) {
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
    if (req.body == null){
        res.status(400);
        res.send({'msg': '400 Bad Request - Object Empty'});
        return;
    }
    collectionsModel.addNewCol(req.body, function (err) {
        if (err) {
            res.status(400);
            res.send({'msg': '400 Bad Request - Error'});
        }
        else {
            res.status(200);
            res.send({'msg': '200 Successful Operation'});
        }
    });

}); // END OF ADD A NEW COLLECTION

// ADD A NEW ITEM INTO COLLECTION USING COLLECTIONS ID
app.post('/collections/:id', function(req, res) {

    if (req.params.id.length === 12 || req.params.id.length === 24) {
        collectionsModel.addNewItem(req.params.id, req.body, function (err) {
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
    var updateName = req.query.updateName;

    if (req.params.id.length === 12 || req.params.id.length === 24) {
        //UPDATE THE NAME OF THE COLLECTION
        if (updateName) {
            if (req.body.name == null){
                res.status(400);
                res.send({'msg': '400 Bad Request - Name not defined'});
                return;
            }
            collectionsModel.updateColName(req.params.id, req.body, function (err) {
                if (err) {
                    res.status(400);
                    res.send({'msg': '400 Bad Request'});
                    console.log(err);
                    return;
                }
                res.status(200);
                res.send({'msg': '200 Collection renamed'});
            });
        }
        //UPDATE WHOLE 'Elements' ARRAY
        else if (updateAll) {
            collectionsModel.updateArrayAll(req.params.id, req.body, function (err) {
                if (err) {
                    res.status(400);
                    res.send({'msg': '400 Bad Request'});
                    console.log(err);
                    return;
                }
                res.status(200);
                res.send({'msg': '200 All Items Updated in "Elements" array'});

            });
        }
        //UPDATE ONE ELEMENT IN 'Elements' ARRAY
        else {
            collectionsModel.updateArrayOne(req.params.id, req.body, function (err) {
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
    var deleteAllCol = req.query.deleteAllCol;
    var deleteCol = req.query.deleteCol;
    var deleteAll = req.query.deleteAll;


    if (req.params.id.length === 12 || req.params.id.length === 24) {

        // !!! DELETE ALL COLLECTIONS FOR USER !!!
        if (deleteAllCol) {
            collectionsModel.deleteAllCol(req.params.id, function (err) {
                if (err) {
                    console.log(err);
                    return;
                }
                res.status(200);
                res.send({'msg': '200 Successful Operation'});

            });
        }
        //DELETE COLLECTION ITSELF PARSING COLLECTION ID
        else if (deleteCol) {
            collectionsModel.deleteCol(req.params.id, function (err) {
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
        //DELETE ALL ELEMENTS IN THE 'Elements' ARRAY PARSING COLLECTION ID
        else if (deleteAll) {
            collectionsModel.deleteAll(req.params.id, function (err) {
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
        //DELETE ONE ELEMENT FROM COLLECTION
        else {
            collectionsModel.deleteOne(req.params.id, req.body, function (err) {
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
            });
        }
    } else {
        res.status(400);
        res.send({'msg': '400 Bad Request'});
    }

}); // END OF UPDATE AN EXISTING COLLECTION

module.exports = app;