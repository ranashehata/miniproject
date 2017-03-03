var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// profile Schema
var ProfileSchema = mongoose.Schema({
	name: {
		type: String,
		index:true
	},
	linktowork: {
		type: String
	},
    fileupload:{
        type:file
    },
});

var profile= module.exports = mongoose.model('profile', ProfileSchema);

module.exports.createprofile = function(newprofile, callback){
	bcrypt.genSalt(10, function(err, salt) {
	  
	        newprofile.save(callback);
	    
	});
}

