var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:suitsup22suke2016@ds055855.mlab.com:55855/infobaza');


var db = mongoose.connection;

//USER SCHEMA
var UserSchema = mongoose.Schema({
	email:{
		type:String,
		index:true
	},
	password:{
		type:String
	},
	name:{
		type:String
	}
});


var User = module.exports = mongoose.model('User',UserSchema);

module.exports.createUser = function(newUser,callback){
	newUser.save(callback);
}