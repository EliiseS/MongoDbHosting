var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectId;
var url = 'mongodb://localhost:27017/hosting';
var bcrypt = require('bcryptjs');
var BodyParser = require('body-parser'); // middle

//FOR GENERATING HASH
var md5 = require('js-md5');

//FOR SENDING EMAILS
var email   = require("../node_modules/emailjs/email");
var server  = email.server.connect({
   user:    "mongo.mango.dbhosting", 
   password:"12345679Kokos", 
   host:    "smtp.gmail.com", 
   ssl:     true
});

// Import events module
var events = require('events');
// Create an eventEmitter object
var eventEmitter = new events.EventEmitter();


//REGISTER NEW USER  ---------------------------------------------------------------------------------
app.post('/register', function(req, res) {
    var user = req.body; 

    var listner0001 = function listner0001() {
        //PASSWORD ENCRYPTION
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(req.body.password, salt, function(err, hash) {
                 user.password = hash;
            });
        });

        delete user.password2;
     
        MongoClient.connect(url, function(err, db) {

            var collection = db.collection('users');

            collection.insert(user,function(err, data) {
                var body = "200";
                res.end(body);
                db.close();
            });
        });
    };// END of listner0001

    eventEmitter.addListener('allowedToCreateUser', listner0001);

    //================================================================

    MongoClient.connect(url, function(err, db) {

        var collection = db.collection('users');
        console.log("EMAIL IN QUERY");
        console.log(user.email);
        collection.find({'email':user.email}).toArray(function(err, xxx) {
            var length = xxx.length;
            
            if(length>0){
              var body = "409";
              res.end(body);
            }
            if(length==0){
              eventEmitter.emit('allowedToCreateUser');
            }
            db.close();
        });
    });
}); // END of REGISTER

//LOGIN NEW USER  ---------------------------------------------------------------------------------
app.post('/login', function(req, res) {
   var user = req.body;

        MongoClient.connect(url, function(err, db) {

        var collection = db.collection('users');

        collection.find({'email':user.email}).toArray(function(err, data) {
            var length = data.length;
            
            if(length==0){
              var body = "404";
              res.end(body);
            }
            if(length>0){
              var userFromDb = data[0];
              // DECRYPT PASSWORDS AND COMPARE THEM 
                bcrypt.compare(user.password, userFromDb.password, function(err, answer) {
                    if(answer==true){
                        delete userFromDb.password;
                        res.send(userFromDb);
                    }else{//IF PASSWORDS DON'T MATCH
                        res.end("401");
                    }
                });
            }
            db.close();
        });
    });
});//login

//RESET PASS  ---------------------------------------------------------------------------------
app.post('/reset-pass', function(req, res) {
    var user = req.body;
    
    MongoClient.connect(url, function(err, db) {

        var collection = db.collection('users');

        //FIND USER WITH EMAIL PROVIDED BY USER
           collection.findOne({'email':user.email},function(err, data) {
           //console.log("DATA FROM DB " + data);
           var userFromDB = data;

           if(err){

           }else{// IF THERE IS NO USER WITH THIS EMAIL
                if(data==undefined){
                    console.log("data==undefined");
                 res.send("404");
               }
               else{//WE HAVE EMAIL MATCH --> GENERATE AND SEND NEW TEMPORARY PASS
                  console.log("data!==undefined");
                   
                   // listener #1
                   var listner1 = function listner1(passForUser,passForDB) {
                       MongoClient.connect(url, function(err, db) { // UPDATE USER OLD PASSWORD TO NEWLY GENERATED HASH

                            var collection = db.collection('users');

                            collection.update({'email':user.email},{
                                $set:{"password":passForDB}
                            },function(err, results) {
                                sendEmail(userFromDB,passForUser);
                                res.send("200");
                                db.close();
                            });
                        });
                    };//listener #1

                    // Bind the connection event with the listner1 function
                    eventEmitter.addListener('passChanged', listner1);

                    var password = md5(generateRandomString());//GENERATE NEW HASH PASSWORD
                        
                       //PASSWORD ENCRYPTION
                        bcrypt.genSalt(10, function(err, salt) {
                            bcrypt.hash(password, salt, function(err, hash) {
                                 var newPass = hash;
                                 eventEmitter.emit('passChanged',password,newPass);
                            });
                        });//bcrypt.genSalt
               }// END OF = WE HAVE EMAIL MATCH
           }// END OF // IF THERE IS NO USER WITH THIS EMAIL
        });// END OF collection.findOne
    db.close();
    });//END OF MongoClient.connect
 

});///END reset-pass

//CHANGE PASSWORD  ---------------------------------------------------------------------------------
app.post('/change-password', function(req, res) {
    
    var profile = {};
    profile.email = req.body.email;
    profile.password = req.body.password;



      // listener #1
     var updatePassword = function updatePassword(encyptedPass) {
         MongoClient.connect(url, function(err, db) { 

              var collection = db.collection('users');

              collection.update({'email':profile.email},{
                  $set:{"password":encyptedPass}
              },function(err, results) {
                    var body = "200";
                    res.end(body);
                    db.close();
                 });
            });
        };//listener #1

    // Bind the connection event with the listner1 function
    eventEmitter.addListener('passEncrypted', updatePassword);

    //PASSWORD ENCRYPTION
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(profile.password, salt, function(err, hash) {
             var encyptedPass = hash;
             eventEmitter.emit('passEncrypted',encyptedPass);
        });
    });
    
});//END OF CHANGE PASSWORD

//CHANGE EMAIL  ---------------------------------------------------------------------------------
app.post('/change-email', function(req, res) {
    var profile = req.body;

    var listner0002 = function listner0002() {
      MongoClient.connect(url, function(err, db) { 

              var collection = db.collection('users');

              collection.update({'_id':ObjectID(profile._id)},{
                  $set:{"email":profile.email}
              },function(err, results) {
                if(err){
                  console.log("ERROR");
                }else{
                    var body = "200";
                    res.end(body);
                    db.close();
                }
                 });
            });
    };// END of listner0002

    eventEmitter.addListener('allowedToChangeEmail', listner0002);

    MongoClient.connect(url, function(err, db) {

        var collection = db.collection('users');
        collection.find({'email':profile.email}).toArray(function(err, xxx) {
            var length = xxx.length;
            
            if(length>0){
              var body = "409";
              res.end(body);
            }
            if(length==0){
              eventEmitter.emit('allowedToChangeEmail');
            }
            db.close();
        });
    });
});//END OF CHANGE EMAIL

//Generate some random string in order to have material for creating HASH for tem password
function generateRandomString(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

//Send email with temp password
function sendEmail(user,password){

    var recipient = user.email;

    //console.log("recipient = " + recipient);

    server.send({
       text:    "Hello " + user.name + ", as per your request, here is your temporary password: " + password,
       from:    "mongo.mango.dbhosting@gmail.com", 
       to:       recipient,
       subject: "Password reseted"
    }, function(err, message) { console.log(err || message); });
};


module.exports = app;