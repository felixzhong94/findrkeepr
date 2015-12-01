var mongoose = require('mongoose');

module.exports = mongoose.model('Enrollments',{
	Class_ID: { type:String, default:''},
	Facebook_Token: {type:String, default:''},
	Team_ID: {type: String, default:''}
});
