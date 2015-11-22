var mongoose = require('mongoose');

module.exports = mongoose.model('Enrollments',{
	Class_ID: { type:String, default:''},
	User_ID: {type:String, default:''},
	Team_ID: {type: String, default:''}
});
