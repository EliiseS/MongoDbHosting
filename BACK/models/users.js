var mongoose = require('mongoose');
mongoose.connect('<db_connection_string>/infobaza');


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