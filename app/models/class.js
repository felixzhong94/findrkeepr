var mongoose = require('mongoose');

module.exports = mongoose.model('class', {
	Creator_ID: { type: mongoose.Schema.ObjectId, ref:'User'},
	Description: { type: String, default:''},
	Name: { type: String, default:''},
	Hashcode: { type: String, default:''},
	Timestamp: { type:Date , default: Date.now}
});
