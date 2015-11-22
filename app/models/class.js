var mongoose = require('mongoose');
var shortid = require('shortid');

module.exports = mongoose.model('class', {
	Creator_ID: { type: mongoose.Schema.ObjectId, ref:'User'},
	Description: { type: String, default:''},
	Name: { type: String, default:''},
	Hashcode: { 
		type: String, 
		unique: true,
		default: shortid.generate
	},
	Timestamp: { type:Date , default: Date.now}
});
