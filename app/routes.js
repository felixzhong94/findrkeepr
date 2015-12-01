var User = require('./models/user');
var Classes = require('./models/class');
var Enrollment = require('./models/enrollment');
var async = require('async');
function getUsers(res){
	User.find(function(err, users) {
		if (err)
			res.send(err)

		res.json(users); // return all todos in JSON format
	});
};

function getClasses(res){
	Classes.find(function(err, classes) {
		if(err)
			res.send(err)

		res.json(classes);
	});
};

function getEnrollment(res){
	Enrollment.find(function(err, enrollment) {
		if(err)
			res.send(err)

		res.json(enrollment);
	});
};

module.exports = function(app) {

	// api ---------------------------------------------------------------------
	app.get('/api/users', function(req, res) {
		getUsers (res);
	});

	/*app.get('/api/users/:user_id', function(req, res) {
		User.find({_id : req.params.user_id},function(err, users) {
			if (err)
				res.send(err)
			res.json(users);
		});
	});*/

	app.get('/api/users/:user_token', function(req, res) {
		User.find({Facebook_Token : req.params.user_token},function(err, users) {
			if (err)
				res.send(err)
			res.json(users);
		});
	});


	app.get('/api/class', function(req, res) {
		getClasses(res);
	});

	/*app.get('/api/enrollment', function(req, res) {
		getEnrollment(res);
	});*/

	// Post request to try to fix bugs.  Does NOT write anything.
	app.post('/api/getClass', function(req, res){
		console.log("Requested hash: " + req.body.class_code);
		Classes.findOne({Hashcode: req.body.class_code},function(err, classes){
			if(err)
			{
				res.json({
					success: false,
					message: 'An error occurred while trying to find your class.'
				});
			}
			if(!classes)
			{
				res.json({
					success: false,
					message: 'Your class was not found.'
				});
			}
			else
			{
				console.log("Found hash: " + classes.Hashcode);
				Enrollment.findOne({Facebook_Token: req.body.user_token, Class_ID: req.body.class_code}, function(err, enrollment){
					if(err)
					{
						res.json({
							success: true,
							result: classes,
							enrolled: false,
						});
					}
					else if(enrollment == null)
					{
						res.json({
							success: true,
							result: classes,
							enrolled: false
						});
					}
					else
					{
						res.json({
							success: true,
							result: classes,
							enrolled: true,
							enrollment: enrollment
						});
					}
				});
			}
		});
	});


	app.get('/api/Enrollment/:user_token', function(req, res) {
		console.log("Hash requested: " + req.params.user_token);
		Enrollment.find({Facebook_Token : req.params.user_token},function(err, enrollment) {
			if(err)
				res.send(err)

		

			async.map(enrollment, function(key, next){
					Classes.findOne({Hashcode: key.Class_ID},function (err,result){
						next(err, result);
					});
				}, function (err, result){
					if(err)
						res.send(err);
					
					Classes.find({Creator_ID: req.params.user_token},function(err, owned) {
						if(err)
							res.send(err)
						res.json({
							success: true,
							enrolled: result,
							owned: owned
						});
					});
				}
			);
		});
	});



	app.get('/api/classmate/:hashcode', function(req, res) {
		Enrollment.find({Class_ID : req.params.hashcode},function(err, enrollment) {
			if(err)
				res.send(err)
			async.map(enrollment, function(key, next){
					User.findOne({Facebook_Token: key.Facebook_Token},function (err,result){
						next(err, result);
					});
				}, function (err, result){
					if(err)
						res.send(err);
					res.json({
						success: true,
						result: result
					});
				}
			);
		});
	});


	/*app.post('/api/getEnrolledClass', function(req, res) {
		Enrollment.find({Facebook_Token : req.body.Facebook_Token},function(err, enrollment) {
			if (err)
				res.send(err)
			res.json({
				success: true,
				enrollment: enrollment
			});
		});
	});*/

	app.get('/api/allEnrollments', function(req, res){
		getEnrollment(res);
	});
	
	/*
	app.get('/api/ClassList/:user_token', function(req, res) {
		var enrollmentList = [];
		var enrollmentCursor = Enrollment.find({});
	});
	*/


	// create todo and send back all todos after creation
	app.post('/api/users', function(req, res) {
		User.findOne({Facebook_Token:req.body.Facebook_Token},function(err,user){
			if (!user) {
   				//console.log("Inserting User");
				User.create({
					Description : req.body.description,
					Name : req.body.name,
					//Classes_Enrolled : req.body.classes,
					Facebook_Token : req.body.Facebook_Token,	
					done : false
				}, function(err, user) {
					if (err)
						res.send(err);
					res.json({
						success: true,
						user
					});
				});
  			
			} else {
    				//console.log('User Already Exists');
				res.json({
					success: false,
					message: 'User already exists',
					user
				});	
			}
		});


	});

	app.purge('/api/users', function(req, res) {
		User.remove(function(err, users) {
			if (err)
				res.send(err);
			getUsers(res);
		});
	});

	app.purge('/api/class', function(req, res) {
		Classes.remove(function(err, classes) {
			if (err)
				res.send(err);
			getClasses(res);
		});
	});


	app.post('/api/class', function(req, res) {
		User.findOne({Facebook_Token:req.body.Facebook_Token},function(err,user){
			if (!user) {
				res.json({ 
					success: false, 
					message: 'Invalid Facebook_Token'
				});
			} else {
				Classes.create({
					Creator_ID : req.body.Facebook_Token,
					Description : req.body.description,
					Name : req.body.name,
					done : false
				}, function(err, classes) {
					if (err)
						res.send(err);
					res.json({
						success: true,
						classes
					});
					//res.json(classes);
				});

			}
		});
	});

	app.post('/api/updateUser', function(req, res){
		User.findOne({Facebook_Token: req.body.Facebook_Token},function(err,user){
			console.log(req.body.Name);
			console.log(req.body.Description);
			console.log(req.body.Facebook_Token);
			if(!user)
			{
				res.json({
					success: false,
					message: 'Invalid Facebook_Token'
				});
			}
			else
			{
				var updateResult = User.update({Facebook_Token: req.body.Facebook_Token}, {$set:{Name: req.body.Name, Description: req.body.Description}}, function(err, numResults, updateResult){
				console.log(updateResult);
				if(updateResult.writeError == null && updateResult.writeConcernError == null)
				{
					//console.log(updateResult.nMatched);
					//console.log(updateResult.nModified);
					res.json({
						success: true
					});
				}
				else
				{
					res.json({
						success: false
					});
				}});
			}
		});
	});


	/*app.post('/api/class', function(req, res) {
		Classes.create({
			Creator_id : req.body.creator,
			Description : req.body.description,
			Name : req.body.name,
			//Hashcode : req.body.hashcode,
			//Timestamp : req.body.timestamp,
			done : false
		}, function(err, classes) {
			if (err)
				res.send(err);

			//getClasses(res);
			res.json(classes);
		});
	});*/

	app.post('/api/removeEnrollment', function(req,res){
		Enrollment.findOne({Class_ID: req.body.classid, Facebook_Token: req.body.Facebook_Token}, function(err, enroll){
			if(err)
			{
				res.json({
					success: false
				});
			}
			else if(!enroll)
			{
				res.json({
					success: true
				});
			}
			else
			{
				Enrollment.remove({Class_ID: req.body.classid, Facebook_Token: req.body.Facebook_Token}, function(err){
					if(err)
					{
						res.json({
							success: false
						});
					}
					else
					{
						res.json({
							success: true
						});
					}
				});
			}
		});
	});

	app.post('/api/enrollment', function(req, res) {
	console.log("Attempting to create enrollment with user " + req.body.Facebook_Token + " and class code " + req.body.classid);
	Enrollment.findOne({Class_ID: req.body.classid, Facebook_Token: req.body.Facebook_Token}, function(err, enroll){
		if(err)
		{
			console.log("Error occurred while checking for duplicate enrollments");
			res.json({
				success: false
			});
		}
		else if(enroll)
		{
			console.log("Enrollment already exists");
			res.json({
				success: true,
				enrollment: enroll
			});
		}
		else
		{
			Enrollment.create({
				Class_ID : req.body.classid,	
				Facebook_Token : req.body.Facebook_Token,
				Team_ID : 0,
				done : false
			}, function(err, enrollment) {
				if (err)
				{
					console.log("Error occurred while trying to create enrollment");
					res.json({
						success: false
					});
				}
				console.log("Enrollment successfully created");
				res.json({
					success: true,
					enrollment: enrollment
				});
			});
		}
	});
		
	/*	User.put(User.findById(req.body.userid, function(err,user)) {
			user.Classes_Enrolled = req.body.classid;
			user.save(function (err) {
*/
	});	

	//app.post('/api/class', function(req, res) {

	/*	User.find({Facebook_Token : req.params.user_token},function(err, user) {
			if (err)
				res.send(err)
		});
*/
	/*	Classes.create({
			Creator_id : req.body.creator,
			//Creator_id : user._id,
			Description : req.body.description,
			Name : req.body.name,
			Hashcode : req.body.hashcode,
			//Timestamp : req.body.timestamp,
			done : false
		}, function(err, classes) {
			if (err)
				res.send(err);

			getClasses(res);
		});
	});

*/

	// delete a todo
	app.delete('/api/users/:user_id', function(req, res) {
		User.remove({
			_id : req.params.user_id
		}, function(err, users) {
			if (err)
				res.send(err);

			getUsers(res);
		});
	});

	app.delete('/api/class/:class_id', function(req, res) {
		Classes.remove({
			_id : req.params.class_id
		}, function(err, classes) {
			if (err)
				res.send(err);

			getClasses(res);
		});
	});

	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
};
