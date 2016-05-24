var express = require('express');
var app = express();

var collectionsModel = require('../models/collections');
var response = require('../services/responses');


//VIEW COLLECTION(S)  ---------------------------------------------------------------------------------
app.get('/collections/:id', function(req, res) {
    var getAll = req.query.getAll;

    if (req.params.id.length === 12 || req.params.id.length === 24) {
        //VIEW ALL COLLECTIONS FOR USER USING USER ID
        if (getAll) {
            collectionsModel.getAll(req.params.id, function (err, data) {
                if (err) {
                    response.errorInternalServer(res, err);
                    return;
                }
                else if (data == null) {
                    response.errorNotFound(res, "User not found");
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
                    response.errorInternalServer(res, err);
                    return;
                }
                else if (data == null) {
                    response.errorNotFound(res);
                    return;
                }
                res.status(200);
                res.send(data);

            });
        }

    } else {
        response.errorBadRequest(res);
    }

}); // END OF VIEW COLLECTION(S)


// GET ALL COLLECTIONS - TESTING PURPOSES  ------------------------------------------------------------------
app.get('/collections', function(req, res) {
    var getAllCollections = req.query.getAllCollections;

    if (getAllCollections) {
        collectionsModel.getAllCollections(function (err, data) {
            if (err) {
                response.errorInternalServer(res, err);
                return;
            }
            if (data === null) {
                response.errorNotFound(res, "No collections found");
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
        response.errorRequestNotAcceptable(res);
        return;
    }
    if (req.body.user_id.length !== 12 && req.body.user_id.length !== 24) {
        response.errorBadRequest(res);
        return;
    }
    collectionsModel.addNewCol(req.body, function (err, result) {
        if (err) {
            response.errorInternalServer(res, err);
            return;
        }
        else if (result.result.n == 1) {
            response.successCreated(res, "New collection created");
            return;
        }
        //Could I get here? I don't know!
        response.errorBadRequest(res, "Uknown error");
    });

}); // END OF ADD A NEW COLLECTION


// Update idea: Find the corresponding user_id in the users collection before adding
//********************************************************************************

// ADD A NEW ITEM INTO COLLECTIONS 'Elements' ARRAY USING COLLECTIONS ID ---------------------------------------
app.post('/collections/:id', function(req, res) {

    if (Object.keys(req.body).length === 0 && req.body.constructor === Object){
        response.errorRequestNotAcceptable(res);
        return;
    }
    if (req.params.id.length === 12 || req.params.id.length === 24) {
        collectionsModel.addNewItem(req.params.id, req.body, function (err, result) {
            if (err) {
                response.errorInternalServer(res, err);
                return;
            }
            else if (result.result.nModified > 0) {
                response.successOK(res, "New item added into collection");
                return;
            }
            //COLLECTION NOT FOUND
            response.errorNotFound(res);
        });
    }else {
        response.errorBadRequest(res);
    }

}); // END OF UPDATE AN EXISTING COLLECTION

//UPDATE COLLECTION USING COLLECTION ID
app.put('/collections/:id', function(req, res) {
    var updateAll = req.query.updateAll;
    var updateName = req.query.updateName;
    if (Object.keys(req.body).length === 0 && req.body.constructor === Object){
        response.errorRequestNotAcceptable(res);
        return;
    }

    if (req.params.id.length === 12 || req.params.id.length === 24) {
        //UPDATE THE NAME OF THE COLLECTION USING COLLECTION ID
        if (updateName) {

            if (req.body.name === undefined){
                response.errorRequestNotAcceptable(res, "Name not defined");
                return;
            }
            collectionsModel.updateColName(req.params.id, req.body, function (err, result) {
                if (err) {
                    response.errorInternalServer(res, err);
                    return;
                }
                else if (result.result.nModified > 0) {
                    response.successOK(res, "Collection renamed");
                    return;
                }
                response.errorNotFound(res);
            });
        }
        //UPDATE WHOLE 'Elements' ARRAY  USING COLLECTION ID
        else if (updateAll) {

            collectionsModel.updateAll(req.params.id, req.body, function (err, result) {
                if (err) {
                    response.errorInternalServer(res, err);
                    return;
                }
                else if (result.result.nModified > 0) {
                    response.successOK(res, "All items updated in collection");
                    return;
                }
                response.errorNotFound(res);

            });
        }
        //UPDATE ONE ELEMENT IN 'Elements' ARRAY  USING COLLECTION ID
        else {
            if (req.body.originalItem === undefined || req.body.updatedItem === undefined){
                response.errorRequestNotAcceptable(res, "originalItem or updatedItem not defined");
                return;
            }
            collectionsModel.updateOne(req.params.id, req.body, function (err, result) {
                console.log(result);
                if (err) {
                    response.errorInternalServer(res, err);
                    return;
                }
                else if (result.result.nModified > 0) {
                    return response.successOK(res, "Item updated in collection");

                }
                //Did we find anything matching our query?
                else if (result.result.n > 0) {
                    return response.errorConflict(res, "Original item are the same as updated items");

                }
                response.errorNotFound(res);

            });

        }

    }else {
        response.errorBadRequest(res);
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
            collectionsModel.deleteAllCol(req.params.id, function (err, result) {
                if (err) {
                    response.errorInternalServer(res, err);
                    return;
                }
                else if (result.result.n > 0) {
                    return response.successOK(res, "All collections removed for user. Total number of removed: " + result.result.n);
                }
                response.errorNotFound(res);
            });
        }
        //DELETE COLLECTION ITSELF PARSING COLLECTION ID
        else if (deleteCol) {
            collectionsModel.deleteCol(req.params.id, function (err, result) {
                if (err) {
                    return response.errorInternalServer(res, err);
                }
                else if (result.result.n > 0) {
                    return response.successOK(res, "Collection removed");

                }
                response.errorNotFound(res);

            });
        }
        //CLEAR ALL ELEMENTS IN THE 'Elements' ARRAY PARSING COLLECTION ID
        else if (deleteAll) {
            collectionsModel.deleteAll(req.params.id, function (err, result) {
                if (err) {
                    response.errorInternalServer(res, err);
                    return;
                }
                // Did we delete anything?
                else if (result.result.nModified > 0) {
                    return response.successOK(res, "Collection cleared");
                }
                //Did we find anything matching our query?
                else if (result.result.n > 0) {
                    return response.errorConflict(res, "Collection is already empty")

                }
                response.errorNotFound(res);
            });
        }
        //DELETE ALL ELEMENTS FROM COLLECTION THAT MATCH THE QUERY
        else {
            if (Object.keys(req.body).length === 0 && req.body.constructor === Object){
                response.errorRequestNotAcceptable(res);
                return;
            }
            collectionsModel.deleteOne(req.params.id, req.body, function (err, result) {
                console.log(result);
                if (err) {
                    response.errorInternalServer(res, err);
                    return;
                }
                //Did we modify any elements?
                else if (result.result.nModified > 0) {
                    return successOK(res, "Item(s) deleted");
                }
                response.errorNotFound(res);
            });
        }
    } else {
        response.errorBadRequest(res);
    }

}); // END OF UPDATE AN EXISTING COLLECTION


//SERVER RESPONSES ---------------------------------------------------------------------


module.exports = app;