var express = require('express');
var app = express();

var bcrypt = require('bcryptjs');

//My modules
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



//REGISTER NEW USER  ---------------------------------------------------------------------------------
app.post('/register', function(req, res) {

    console.log("REQ BODY IN REGISTER");
    console.log(req.body);

    if (req.body.name === undefined || req.body.password === undefined || req.body.email === undefined ){
        return response.errorRequestNotAcceptable(res);
    }

    //Check if email exists, if no, continue function
    // false = if the email is needed for anything.
    getUser(req,res, false, function () {
        //PASSWORD ENCRYPTION
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(req.body.password, salt, function(err, hash) {
                if (err) {
                    console.log(err);
                    return response.errorInternalServer(res, err);
                }
                req.body.password = hash;

                usersModel.addUser(req.body, function (err, result) {
                    if (err) {
                        response.errorInternalServer(res, err);
                    }
                    else if (result.result.n == 1) {
                        response.successCreated(res, "New user created");
                    } else {
                        response.errorBadRequest(res, "Unknown error");
                    }
                }); //End of addUser
            }); //End of hash
        });//End of gensalt
    });//


}); // END of REGISTER

//LOGIN USER  ---------------------------------------------------------------------------------
app.post('/login', function(req, res) {

    console.log("REQ BODY IN LOGIN");
    console.log(req.body);

    if (req.body.email === undefined || req.body.password === undefined ){
        return response.errorRequestNotAcceptable(res);
    }
    //Trying to find user with the email
    getUser(req,res, true, function (data) {
            //console.log(data[0]);

            // DECRYPT PASSWORDS AND COMPARE THEM
            bcrypt.compare(req.body.password, data[0].password, function(err, answer) {
                if(answer){
                    delete data[0].password;
                    response.successOKData(res, data[0]);
                }else{//IF PASSWORDS DON'T MATCH
                    response.errorUnauthorized(res, "Wrong password for user:" + req.body.email + "!");
                }
            });
    });
});//END OF LOGIN USER



//RESET PASS  ---------------------------------------------------------------------------------
app.post('/reset-pass', function(req, res) {
    if (req.body.email === undefined || req.body.password === undefined ){
        return response.errorRequestNotAcceptable(res);
    }

    var generatedPass = md5(generateRandomString());//GENERATE NEW RANDOM PASSWORD
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(generatedPass, salt, function(err, hashedPass) {

            usersModel.updatePass(req.body.email, hashedPass, function (err, result) {
                if (err) {
                    response.errorInternalServer(res, err);
                }
                else if (result.result.nModified > 0) {
                    getUser(req,res, true, function (data) {
                        sendEmail(data[0], generatedPass);
                    });
                    response.successOK(res, "Password reset");
                }
                else {
                    response.errorNotFound(res, "User with email " + req.body.email +  " not found!");
                }
            });
        });
    });//bcrypt.genSalt

});///END RESET PASS


//CHANGE PASSWORD  ---------------------------------------------------------------------------------
app.post('/change-password', function(req, res) {

    if (req.body.email === undefined || req.body.password === undefined ){
        return response.errorRequestNotAcceptable(res);
    }

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hashedPass) {
            console.log(hashedPass);

            usersModel.updatePass(req.body.email, hashedPass, function (err, result) {
                if (err) {
                    response.errorInternalServer(res, err);
                }
                else if (result.result.nModified > 0) {
                    response.successOK(res, "Password updated");
                }
                else {
                    response.errorNotFound(res, "User with email " + req.body.email +  " not found!");
                }
            });
        });
    });//bcrypt.genSalt


});//END OF CHANGE PASSWORD

//CHANGE EMAIL  ---------------------------------------------------------------------------------
app.post('/change-email', function(req, res) {

    if (req.body.email === undefined || req.body._id === undefined ){
        return response.errorRequestNotAcceptable(res);
    }

    usersModel.updateEmail(req.body.email, req.body._id, function (err, result) {
        if (err) {
            response.errorInternalServer(res, err);
        }
        else if (result.result.nModified > 0) {
            response.successOK(res, "Password updated");
        }
        else {
            response.errorNotFound(res, "User with email " + req.body.email +  " not found!");
        }
    });


});//END OF CHANGE EMAIL

//SEND EMAIL  ---------------------------------------------------------------------------------
app.post('/send-email', function(req, res) {
    var contact = req.body;

    if (contact.message === undefined || contact.name === undefined || contact.email === undefined ){
        return response.errorRequestNotAcceptable(res);
    }

    var sqnum = "<html><body><h2>Message from: " + contact.name + " " + contact.lastname + "</h2><br><p><strong>Message:</strong></p><p>" + contact.message + "<br><br><p>User's details</p><p><strong>Email: </strong>" + contact.email + "</p><p><strong>Phone: </strong>" + contact.phone + "</p></body></html>" ;


    var message = {
        text:    contact.message,
        from:    contact.email,
        to:      "kalistratov@live.com",//
        subject: "Message from MongoMango Contact form",
        attachment:
            [
                {data:sqnum, alternative:true}
            ]
    };

    // send the message and get a callback with an error or details of the message that was sent
    server.send(message, function(err) {
        if(err){
            response.errorInternalServer(res, err);
        }
        else{
            response.successOK(res, "Message sent");
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
function sendEmail(user, password){

        server.send({
            text: "Hello " + user.name + ", as per your request, here is your temporary password: " + password,
            from: "mongo.mango.dbhosting@gmail.com",
            to: email,
            subject: "Password reseted"
        }, function (err, message) {
            if(err){
                response.errorInternalServer(res, err);
            }
            else{
                response.successOK(res, "Message sent");
                console.log(message);
            }
        });
};

function getUser(req, res, isUserNeeded, cb) {
    console.log("Checking email: " + req.body.email);

    usersModel.getUser(req.body.email, function (err, data) { //Function (null, data)
        if (err) {
            response.errorInternalServer(res, err);
        }//No user found
        else if (data == null) {
            if (!isUserNeeded){
                cb();
            } else {
                response.errorNotFound(res, "User with email" + req.body.email +  " not found!");
            }
        }//We have a user
        else if (data[0].email === req.body.email) {
            if (isUserNeeded) {
                cb(data);
            } else {
                response.errorConflict(res, "Email is already registered");
            }
        } else {
            response.errorBadRequest(res, "Unknown error");
        }
    });

}



module.exports = app;
