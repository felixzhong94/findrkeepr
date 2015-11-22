var Todo = require('./models/todo');
var Classes = require('./models/class');

function getTodos(res){
	Todo.find(function(err, todos) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			res.json(todos); // return all todos in JSON format
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
	app.get('/api/todos', function(req, res) {

		// use mongoose to get all todos in the database
		getTodos(res);
	});

	app.get('/api/class', function(req, res) {
		getClasses(res);
	});

	// create todo and send back all todos after creation
	app.post('/api/todos', function(req, res) {

		// create a todo, information comes from AJAX request from Angular
		Todo.create({
			Description : req.body.description,
			Name : req.body.name,
			//Timestamp : req.body.timestamp,
			//Classes_Enrolled : req.body.classes,	
			done : false
		}, function(err, todo) {
			if (err)
				res.send(err);

			// get and return all the todos after you create another
			getTodos(res);
		});

	});

	app.post('/api/class', function(req, res) {
		Classes.create({
			Creator : req.body.creator,
			Description : req.body.description,
			Name : req.body.name,
			Hashcode : req.body.hashcode,
			Timestamp : req.body.timestamp,
			done : false
		}, function(err, todo) {
			if (err)
				res.send(err);

			getTodos(res);
		});
	});

	// delete a todo
	app.delete('/api/todos/:todo_id', function(req, res) {
		Todo.remove({
			_id : req.params.todo_id
		}, function(err, todo) {
			if (err)
				res.send(err);

			getTodos(res);
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
