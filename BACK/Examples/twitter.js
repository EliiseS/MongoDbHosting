var express = require("express");
var app = express();
fs = require('fs');

app.set('view engine', 'ejs');


var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});




var CONSUMER_KEY = "Fu73VKEP8NslOwV8lgGhS1PBJ";
var CONSUMER_SECRET = "yOcnOe05S5HZf8BwnMlFBJPy3FjV6LbDHhVjRWUWuWkZzSnafT";
var TOKEN = "83176730-woQKARN6d3zWaISzCICBRNv1q5Ta4BXnyeaSM0c3G";
var TOKEN_SECRET = "E2zk0xuYn04RDGPI3VO5HZLF1a4Vfha8FpWE3yEpDy5zA";

var Twitter = require('node-twitter');


var twitterStreamClient = new Twitter.StreamClient(
    CONSUMER_KEY,
    CONSUMER_SECRET,
    TOKEN,
    TOKEN_SECRET
);
 
twitterStreamClient.on('close', function() {
    console.log('Connection closed.');
});
twitterStreamClient.on('end', function() {
    console.log('End of Line.');
});
twitterStreamClient.on('error', function(error) {
    console.log('Error: ' + (error.code ? error.code + ' ' + error.message : error.message));
});
twitterStreamClient.on('tweet', function(tweet) {
	console.log(tweet);
    io.emit('chat message', tweet);
 
});
	

 
twitterStreamClient.start(['java']);







app.get('/', function(req, res){
  	res.render('index');
});


var obj = {};

app.get('/about', function (req, res) {


	fs.readFile('about.txt', 'utf-8', function (err, data) {

		if (err) {
			return console.log(err)
		}

		var dataarray = data.split(/\n/);

		obj.title = dataarray[0];
		obj.subtitle = dataarray[1];
		obj.text = dataarray[2];


		res.render('about', obj);


	});


	
});




http.listen(3000, function(){
  console.log('listening on *:3000');
});

//app.listen(3000);