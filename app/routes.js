var User = require('./models/user');
var Classes = require('./models/class');
var Enrollment = require('./models/enrollment');

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

	app.get('/api/enrollment', function(req, res) {
		getEnrollment(res);
	});

	// create todo and send back all todos after creation
	app.post('/api/users', function(req, res) {

		// create a todo, information comes from AJAX request from Angular
		User.create({
			Description : req.body.description,
			Name : req.body.name,
			//Timestamp : req.body.timestamp,
			//Classes_Enrolled : req.body.classes,
			Facebook_Token : req.body.Facebook_Token,	
			done : false
		}, function(err, user) {
			if (err)
				res.send(err);

			// get and return all the todos after you create another
			getUsers(res);
		});

	});

	app.purge('/api/users', function(req, res) {
		User.remove(function(err, users) {
			if (err)
				res.send(err);
			getUsers(res);
		});
	});




	app.post('/api/class', function(req, res) {
		Classes.create({
			Creator_id : req.body.creator,
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

	app.post('/api/enrollment', function(req, res) {
		Enrollment.create({
			Class_ID : req.body.classid,	
			User_ID : req.body.userid,
			Team_ID : req.body.teamid,
			done : false
		}, function(err, enrollment) {
			if (err)
				res.send(err);

			getEnrollment(res);
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
