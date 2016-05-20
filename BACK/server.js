var express = require('express');
var app = express();
var BodyParser = require('body-parser'); // middle
var cors = require('cors');
var db = require('./db.js');

/*
app.engine('jade', require('jade').__express);
app.set('view engine', 'jade');
*/
db.connect('mongodb://admin:suitsup22suke2016@ds055855.mlab.com:55855/infobaza', function(err) {
    if (err) {
        console.log('Unable to connect to Mongo.');
        console.log(err);
        process.exit(1)
    } else {
        app.use(cors());

        app.use(BodyParser.urlencoded({
            extended:true
        }));

        app.use(BodyParser.json());


      
        app.use(require('./routes/authentication.js'));
        app.use(require('./routes/collections.js'));
        app.use(function(req,res){
            res.status(404);
            res.send({"msg":"Page Not Found"});
        });
        app.listen(7000, function() {
            console.log('Listening on port 7000...');

        })
    }
});
