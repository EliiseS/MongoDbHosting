var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/hosting';
var bcrypt = require('bcryptjs');


//REGISTER NEW USER  ---------------------------------------------------------------------------------
app.post('/register', function(req, res) {
    console.log("Trying to register new user...");
    var user = {};
    user.email = req.body.email;
    user.name = req.body.name;

    //PASSWORD ENCRYPTION
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
             user.password = hash;
        });
    });
 
    MongoClient.connect(url, function(err, db) {

        var collection = db.collection('users');

        collection.insert(user,function(err, data) {
            res.status(200);
            res.send({"msg":"200 OK USER CREATED..."});
            console.log("User created")
            db.close();
        });
    });
    
});

//LOGIN NEW USER  ---------------------------------------------------------------------------------
app.post('/login', function(req, res) {
    console.log("Trying to login on SERVER...");
    var login = req.body;
    //var response = res;

    MongoClient.connect(url, function(err, db) {

        var collection = db.collection('users');

        collection.findOne({'email':login.email},function(err, data) {
           console.log(data);
           var userFromDB = data;
           if(err){

           }else{
                if(data==null){
                 res.send("User with specified Email not Found!");
               }
               else{
                // Load hash from your password DB. 
                bcrypt.compare(login.password, userFromDB.password, function(err, answer) {
                    if(answer==true){
                        res.send(userFromDB);
                    }else{
                        res.send("Wrong password");
                    }
                });
               }
           }
        });
    });

    
    
});

//TESTING  ---------------------------------------------------------------------------------
app.get('/test', function(req, res) {
    console.log("200 OK SERVER IS RUNNING...");
    res.send({"msg":"200 OK SERVER IS RUNNING..."});
});


module.exports = app;