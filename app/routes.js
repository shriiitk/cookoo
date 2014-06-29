var app = require('../server');
// load the todo model
// var Tags = require('./models/recipe');
var Recipe = require('./models/recipe');


// api ---------------------------------------------------------------------
// get 10 recipes
app.get('/api/recipes', function(req, res) {

	// use mongoose to get all recipes in the database
	var q = Recipe.find({}).limit(12);
	q.exec(function(err, recipes) {

		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err){
			console.log(err);
			res.send(err);
		}

		res.json(recipes); // return all recipes in JSON format
	});
});

app.get('/api/recipes/search', function(req, res) {

	var q = req.query.q;
	var sort = req.query.sort;
	var start = req.query.start;
	var rows = req.query.rows;

	Recipe.textSearch(q, function (err, output) {
		if (err){
			console.log(err);
			res.send(err);
		}
		console.log(output);
		var list = [];
		for (var i = output.results.length - 1; i >= 0; i--) {
			list.push(output.results[i].obj);
		};
		res.json(list);
	});
});

/*
// create todo and send back all todos after creation
app.post('/api/todos', function(req, res) {

	// create a todo, information comes from AJAX request from Angular
	Todo.create({
		text : req.body.text,
		done : false
	}, function(err, todo) {
		if (err)
			res.send(err);

		// get and return all the todos after you create another
		Todo.find(function(err, todos) {
			if (err)
				res.send(err)
			res.json(todos);
		});
	});

});

// delete a todo
app.delete('/api/todos/:todo_id', function(req, res) {
	Todo.remove({
		_id : req.params.todo_id
	}, function(err, todo) {
		if (err)
			res.send(err);

		// get and return all the todos after you create another
		Todo.find(function(err, todos) {
			if (err)
				res.send(err)
			res.json(todos);
		});
	});
});
*/
// application -------------------------------------------------------------
app.get('*', function(req, res) {
	res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});