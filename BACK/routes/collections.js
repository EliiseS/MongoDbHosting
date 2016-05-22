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
                    errorInternalServer(res, err);
                    return;
                }
                else if (data == null) {
                    errorNotFound(res, "User not found");
                    return;
                }
                res.status(200);
                res.send(data);
            });

        }
        //GET ONE COLLECTION USING COLLECTIONS ID
        else {
            collectionsModel.getOne(req.params.id, function (err, data) {
                if (err) {
                    errorInternalServer(res, err);
                    return;
                }
                else if (data == null) {
                    errorNotFound(res);
                    return;
                }
                res.status(200);
                res.send(data);

            });
        }

    } else {
        errorBadRequest(res);
    }

}); // END OF VIEW COLLECTION(S)


// GET ALL COLLECTIONS - TESTING PURPOSES  ------------------------------------------------------------------
app.get('/collections', function(req, res) {

    var getAllCollections = req.query.getAllCollections;

    if (getAllCollections) {
        collectionsModel.getAllCollections(function (err, data) {
            if (err) {
                errorInternalServer(res, err);
                return;
            }
            if (data === null) {
                errorNotFound(res, "No collections found");
                return;
            }
            res.status(200);
            res.send(data);
        });
    }
});


// ADD A NEW COLLECTION  ----------------------------------------------------------------------
app.post('/collections', function(req, res) {
    if (req.body.name === undefined || req.body.user_id === undefined || req.body.Elements === undefined ){
        errorRequestNotAcceptable(res);
        return;
    }
    if (req.body.user_id.length !== 12 && req.body.user_id.length !== 24) {
        errorBadRequest(res);
        return;
    }
    collectionsModel.addNewCol(req.body, function (err, result) {
        console.log(result);
        if (err) {
            errorInternalServer(res, err);
            return;
        }
        else if (result.result.n == 1) {
            successCreated(res, "New collection created");
            return;
        }
        //Could I get here? I don't know!
        errorBadRequest(res, "Uknown error");
    });

}); // END OF ADD A NEW COLLECTION


// Update idea: Find the corresponding user_id in the users collection before adding
//********************************************************************************

// ADD A NEW ITEM INTO COLLECTIONS 'Elements' ARRAY USING COLLECTIONS ID ---------------------------------------
app.post('/collections/:id', function(req, res) {

    if (Object.keys(req.body).length === 0 && req.body.constructor === Object){
        errorRequestNotAcceptable(res);
        return;
    }
    if (req.params.id.length === 12 || req.params.id.length === 24) {
        collectionsModel.addNewItem(req.params.id, req.body, function (err, result) {
            if (err) {
                errorInternalServer(res, err);
                return;
            }
            else if (result.result.nModified > 0) {
                successOK(res, "New item added into collection");
                return;
            }
            //COLLECTION NOT FOUND
            errorNotFound(res);
        });
    }else {
        errorBadRequest(res);
    }

}); // END OF UPDATE AN EXISTING COLLECTION

//UPDATE COLLECTION USING COLLECTION ID
app.put('/collections/:id', function(req, res) {
    var updateAll = req.query.updateAll;
    var updateName = req.query.updateName;
    if (Object.keys(req.body).length === 0 && req.body.constructor === Object){
        errorRequestNotAcceptable(res);
        return;
    }

    if (req.params.id.length === 12 || req.params.id.length === 24) {
        //UPDATE THE NAME OF THE COLLECTION USING COLLECTION ID
        if (updateName) {

            if (req.body.name === undefined){
                errorRequestNotAcceptable(res, "Name not defined");
                return;
            }
            collectionsModel.updateColName(req.params.id, req.body, function (err, result) {
                if (err) {
                    errorInternalServer(res, err);
                    return;
                }
                else if (result.result.nModified > 0) {
                    successOK(res, "Collection renamed");
                    return;
                }
                errorNotFound(res);
            });
        }
        //UPDATE WHOLE 'Elements' ARRAY  USING COLLECTION ID
        else if (updateAll) {

            collectionsModel.updateAll(req.params.id, req.body, function (err, result) {
                if (err) {
                    errorInternalServer(res, err);
                    return;
                }
                else if (result.result.nModified > 0) {
                    successOK(res, "All items updated in collection");
                    return;
                }
                errorNotFound(res);

            });
        }
        //UPDATE ONE ELEMENT IN 'Elements' ARRAY  USING COLLECTION ID
        else {
            if (req.body.originalItem === undefined || req.body.updatedItem === undefined){
                errorRequestNotAcceptable(res, "originalItem or updatedItem not defined");
                return;
            }
            collectionsModel.updateOne(req.params.id, req.body, function (err, result) {
                if (err) {
                    errorInternalServer(res, err);
                    return;
                }
                else if (result.result.nModified > 0) {
                    successOK(res, "Item updated in collection");
                    return;
                }
                errorNotFound(res);

            });

        }

    }else {
        errorBadRequest(res);
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
                    errorInternalServer(res, err);
                    return;
                }
                successOK(res, "All collections removed for user");

            });
        }
        //DELETE COLLECTION ITSELF PARSING COLLECTION ID
        else if (deleteCol) {
            collectionsModel.deleteCol(req.params.id, function (err, result) {
                if (err) {
                    return errorInternalServer(res, err);
                }

                else if (result.result.n > 0) {
                    return successOK(res, "Collection removed");

                }
                errorNotFound(res);



            });
        }
        //CLEAR ALL ELEMENTS IN THE 'Elements' ARRAY PARSING COLLECTION ID
        else if (deleteAll) {
            collectionsModel.deleteAll(req.params.id, function (err, result) {
                console.log(result);

                if (err) {
                    errorInternalServer(res, err);
                    return;
                }
                else if (result.result.nModified > 0) {
                    successOK(res, "Collection cleared");
                    return;
                }
                else if (result.result.n > 0) {
                    return errorNotModified(res, "Collection is already empty")

                }
                errorNotFound(res);
            });
        }
        //DELETE ONE ELEMENT FROM COLLECTION
        else {
            if (Object.keys(req.body).length === 0 && req.body.constructor === Object){
                errorRequestNotAcceptable(res);
                return;
            }
            collectionsModel.deleteOne(req.params.id, req.body, function (err) {
                if (err) {
                    errorInternalServer(res, err);
                    return;
                }
                else if (result.result.n > 0) {
                    return successOK(res, "Item deleted");
                }
                errorNotFound(res);
            });
        }
    } else {
        errorBadRequest(res);
    }

}); // END OF UPDATE AN EXISTING COLLECTION


//SERVER RESPONSES ---------------------------------------------------------------------

function successOK(res, msg = "Successful operation" ){
    res.status(200);
    res.send({'msg': '200 OK - ' + msg});
}

function successCreated(res, msg = "" ){
    res.status(200);
    res.send({'msg': '201 Created - ' + msg});
}

function errorRequestNotAcceptable(res, msg = "Invalid request format" ){
    res.status(406);
    res.send({'msg': '406 Not Acceptable - ' + msg});
}

function errorBadRequest(res, msg = "Invalid ID") {
    res.status(400);
    res.send({'msg': '400 Bad request - ' + msg});
}

function errorNotFound(res, msg = "Collection not found") {
    res.status(404);
    res.send({'msg': '404 Not Found - ' + msg});
}

function errorInternalServer(res, err) {
    res.status(500);
    res.send({'msg': '404 Internal Server Error'});
    console.log(err);
}

function errorNotModified(res, msg = "Original item are the same as updated items") {
    res.status(304);
    res.send({'msg': '304 Not Modified -'});
    console.log(err);
}



module.exports = app;