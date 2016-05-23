var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectId;
var url = 'mongodb://admin:suitsup22suke2016@ds055855.mlab.com:55855/infobaza';
var bcrypt = require('bcryptjs');
var BodyParser = require('body-parser'); // middle

//NEW
var usersModel = require('../models/authentication');
var response = require('../services/responses');


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

    function encryptPass() {
        console.log(req.body);
        console.log("1");
        //PASSWORD ENCRYPTION
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(req.body.password, salt, function(err, hash) {
                req.body.password = hash;
                delete req.body.password2;

                createUser();

            });
        });
    };// END OF ENCRYPTPASS

    function createUser() {
        usersModel.addUser(req.body, function (err, result) {
            if (err) {
                response.errorInternalServer(res, err);
                return;
            }
            else if (result.result.n == 1) {
                response.successCreated(res, "New user created");
                return;
            }
            response.errorBadRequest(res, "Uknown error");
        });
    } // END OF CREATEUSER

    console.log("EMAIL IN QUERY");
    console.log(req.body.email);
    usersModel.findEmail(req.body.email, function (err, data) {
        if (err) {
            return response.errorInternalServer(res, err);
        }
        //If no email
        else if (data == null) {
            return encryptPass();
        }
        else if (data[0].email === req.body.email){
            return response.errorConflict(res, "Email is already registered")
        }
        response.errorBadRequest(res, "Unknown error");
    });
}); // END of REGISTER

//LOGIN USER  ---------------------------------------------------------------------------------
app.post('/login', function(req, res) {
    var user = req.body;

    usersModel.findEmail(user.email, function (err, data) {

        if (err) {
            response.errorInternalServer(res, err);
        }
        //If email available
        else if (data == null) {
            response.errorNotFound(res, "User" + user.email +  " not found!")
        }

        else if (data[0].email === user.email){
            console.log(data[0]);

            // DECRYPT PASSWORDS AND COMPARE THEM
            bcrypt.compare(user.password, data[0].password, function(err, answer) {
                if(answer==true){
                    delete data[0].password;
                    response.successOKData(res, data[0]);
                }else{//IF PASSWORDS DON'T MATCH
                    response.errorUnauthorized(res, "Wrong password for user:" + user.email + "!");
                }
            });
        }
        else {
            console.log("Something went wrong")
            response.errorBadRequest(res, "Unknown error");
        }

        /*
         collection.find({'email':user.email}).toArray(function(err, data) {
         var length = data.length;

         if(length==0){
         res.status(404);
         res.send({'msg': 'User' + user.email + ' not found!'});
         }
         if(length>0){
         var userFromDb = data[0];
         // DECRYPT PASSWORDS AND COMPARE THEM
         bcrypt.compare(user.password, userFromDb.password, function(err, answer) {
         if(answer==true){
         delete userFromDb.password;
         res.status(200);
         res.send(userFromDb);
         }else{//IF PASSWORDS DON'T MATCH
         res.status(401);
         res.send({'msg': 'Wrong password for user:' + user.email + '!'});

         }
         });
         }
         db.close();
         });*/
    });
});//login

//RESET PASS  ---------------------------------------------------------------------------------
app.post('/reset-pass', function(req, res) {
    var user = req.body;
    console.log("INSIDE /RESET-PASS METHOD");
    console.log(user);

    MongoClient.connect(url, function(err, db) {

        var collection = db.collection('users');
        collection.find({'email':user.email}).toArray(function(err, data) {
            var length = data.length;

            if(length>0){
                // WE HAVE USER WITH PROVIDED EMAIL L 

                var userFromDB = data[0];
                // listener #1
                var listner1 = function listner1(passForUser,passForDB) {
                    MongoClient.connect(url, function(err, db) { // UPDATE USER OLD PASSWORD TO NEWLY GENERATED HASH

                        var collection = db.collection('users');

                        collection.update({'email':user.email},{
                            $set:{"password":passForDB}
                        },function(err, results) {
                            sendEmail(userFromDB,passForUser);
                            res.status(200);
                            res.send({'msg': '200 Successful Operation'});
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

            }
            if(length==0){
                // THERE IS USER WITH PROVIDED EMAIL
                res.status(404);
                res.send({'msg' : '404 User not found'});
            }
            db.close();
        });
    });


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
                res.status(200);
                res.send({'msg': '200 Successful Operation'});
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
                    res.status(200);
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
                res.status(409);
                res.send({'msg' : '409 Conflict'});
                eventEmitter.removeListener('allowedToChangeEmail', listner0002);
            }
            if(length==0){
                eventEmitter.emit('allowedToChangeEmail');
            }
            db.close();
        });
    });
});//END OF CHANGE EMAIL

//SEND EMAIL  ---------------------------------------------------------------------------------
app.post('/send-email', function(req, res) {
    var contact = req.body;

    var sqnum = "<html><body><h2>Message from: " + contact.name + " " + contact.lastname + "</h2><br><p><strong>Message:</strong></p><p>" + contact.message + "<br><br><p>User's details</p><p><strong>Email: </strong>" + contact.email + "</p><p><strong>Phone: </strong>" + contact.phone + "</p></body></html>" ;


    var message = {
        text:    contact.message,
        from:    contact.email,
        to:      "kalistratov@live.com,selingeliise@gmail.com",//
        subject: "Message from MongoMango Contact form",
        attachment:
            [
                {data:sqnum, alternative:true}
            ]
    };

    // send the message and get a callback with an error or details of the message that was sent
    server.send(message, function(err, message) {
        if(!err){
            res.status(200);
            res.send({'msg' : '200 message sent'});
        }
        else{
            res.status(500);
            res.send({'msg' : '500 server error, message not sent'});
        }
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
