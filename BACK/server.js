var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var BodyParser = require('body-parser'); // middle
var cors = require('cors');
var bcrypt = require('bcryptjs');

var authentication = require('./routes/auth.js');
var collections = require('./routes/collections.js');

app.use(cors());

app.use(BodyParser.urlencoded({
	extended:true
}));

app.use(BodyParser.json());

app.use(authentication);
app.use(collections);

app.use(function(req,res){
    res.status(404);
    res.send({"msg":"Page Not Found"});
});

// TESTERIUM   TESTERIUM   TESTERIUM   TESTERIUM   TESTERIUM   TESTERIUM   TESTERIUM
//============================================================================


app.listen(7000);
console.log("API ready to accept requests on PORT:7000...");