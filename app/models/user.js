var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/*
var Product = new Schema({
	title: {type: String, required: true },
	description: { type: String, required: true },
	style: { type: String, unique: true },
	modified: {type: Date, default: Date.now }
});
*/	

var userSchema = new Schema( {
	Description: { type : String, default:''},
	Name: { type: String, default:''},
	Timestamp: { type: Date, default: Date.now},

	Facebook_Token: { type: String, default:''},
	//link to profile pic
	Classes_Enrolled: [{
		Class_ID: { type: mongoose.Schema.ObjectId, ref: 'Class'},
		Team: { type: String, default: ''}
	}]
});

module.exports = mongoose.model('User', userSchema);
