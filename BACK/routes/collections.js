var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var url = 'mongodb://localhost:27017/hosting';
var collections;


//HOW IS IT POSSIBLE? send response(res) if you don't have this object
MongoClient.connect(url, function(err, db) {
    if (err) {
        console.log("Server crashed");
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
                res.status(200);
                res.send(data);
            }
            });
    }  else{
        res.status(400);
        res.send({'msg' : '400 Bad Request'});
    }

}); // END OF VIEW ALL COLLECTIONS FOR USER

//GET ONE COLLECTION  ---------------------------------------------------------------------------------
app.get('/collection/:id', function(req, res) {
    if(req.params.id.length === 12 || req.params.id.length === 24){
        collections.find({'_id': ObjectId(req.params.id)}).toArray(function(err, data) {
            if (data==null){
                res.status(404);
                res.send({'msg': 'No collections found'});
            }
            else{
                res.status(200);
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
    collections.insert(req.body,function(err) {
        if (err) {
            var body = "400";
            res.end(body);
        } else {
            var body = "200";
            res.end(body);
        }
    });
}); // END OF POST A NEW COLLECTION

// PUSH A NEW ITEM INTO COLLECTION
app.post('/collections/:id', function(req, res) {
        var newItem = req.body;

        //if(addMany){
            collections.update({'_id': ObjectId(req.params.id)},{
             $push:{ Elements : {$each : newItem}}}, function (err) {
                if (err) {
                    var body = "666";
                    res.end(body);
                }
                else{
                    var body = "200";
                    res.end(body);
                }
            });
    
}); // END OF UPDATE AN EXISTING COLLECTION

// UPDATE AN EXISTING COLLECTION
app.put('/collections/:id', function(req, res) {

        
    
}); // END OF UPDATE AN EXISTING COLLECTION

//UPDATE COLLECTION
app.patch('/collections/:id', function(req, res) {
    
    
    var updateAll = req.query.updateAll;
    var updateOne = req.query.updateOne;
    
    //UPDATE WHOLE 'Elements array'
    if (updateAll) {
        var collectionForUpdate = req.body;
        console.log(collectionForUpdate);
        collections.update({'_id': ObjectId(req.params.id)}, {
            $set:{"Elements":collectionForUpdate}
        }, function (err) {
            if (err) {
                console.log(err);
                return;
            }
            var body = '200';
            res.end(body);
        });
    }
    //UPDATE ONE ITem
    if (updateOne) {

        collections.update({'_id': ObjectId(req.params.id),Elements:req.body.originalItem},{
            $set:{"Elements.$" : req.body.updatedItem}
        },function(err) {
            if (err){
                console.log(err);
                var body = '666';
                res.end(body);
            }
            var body = '200';
            res.end(body);
        });
    }

}); // END OF UPDATE AN EXISTING COLLECTION



//DELETE ALL COLLECTIONS FOR USER OR ONE COLLECTION  ---------------------------------------------------------------------------------
app.delete('/collections/:id', function(req, res) {
    //noinspection JSUnresolvedVariable
    var deleteAll = req.query.deleteAll;
    var deleteOne = req.query.deleteOne;
    if(req.params.id.length === 12 || req.params.id.length === 24) {
        //DELETE ALL ELEMENTS FROM COLLECTION
        if (deleteAll) {
            collections.remove({'user_id': req.params.id}, function (err) {
                if (err){
                    console.log(err);
                    return;
                }
                res.send({'msg': 'ALL COLLECTIONS REMOVED FOR USER','status':'200'});

            });
        } 
        //DELETE ONE ELEMENT FROM COLLECTION
        if (deleteOne) {
            collections.update({'_id': ObjectId(req.params.id)}, {
                $pull: {Elements:req.body}
            }, function (err) {
                if (err) {
                    console.log(err);
                    return;
                }
                res.send({'msg': 'Element deleted from array','status':'200'});
            });
        }
        //DELETE COLLECTION ITSELF
        if(!deleteAll && ! deleteOne){
            collections.remove({'_id': ObjectId(req.params.id)}, function (err) {
                if (err) {
                    console.log(err);
                    return;
                }
                res.send({'msg': 'Collections removed'});
            });
        }
    } else {
        res.status(400);
        res.send({'msg' : '400 Bad Request'});
    }

}); // END OF DELETE ALL COLLECTIONS FOR USER OR ONE COLLECTION



module.exports = app;