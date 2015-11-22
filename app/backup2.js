var User = require('./models/user');
var Classes = require('./models/class');

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

module.exports = function(app) {

	// api ---------------------------------------------------------------------
	// get all todos
	app.get('/api/users', function(req, res) {

		// use mongoose to get all todos in the database
		getUsers (res);
	});

	app.get('/api/class', function(req, res) {
		getClasses(res);
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

	app.post('/api/class', function(req, res) {
		Classes.create({
			Creator_id : req.body.creator,
			Description : req.body.description,
			Name : req.body.name,
			Hashcode : req.body.hashcode,
			//Timestamp : req.body.timestamp,
			done : false
		}, function(err, todo) {
			if (err)
				res.send(err);

			getClasses(res);
		});
	});

	// delete a todo
	app.delete('/api/users/:user_id', function(req, res) {
		User.remove({
			_id : req.params.user_id
		}, function(err, todo) {
			if (err)
				res.send(err);

			getUsers(res);
		});
	});

	app.delete('/api/class/:class_id', function(req, res) {
		Classes.remove({
			_id : req.params.class_id
		}, function(err, todo) {
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
