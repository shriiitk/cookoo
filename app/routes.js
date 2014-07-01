var app = require('../server');
// load the todo model
// var Tags = require('./models/recipe');
var Recipe = require('./models/recipe');

var nodemailer = require("nodemailer");
var emailConfig	= require('../config/email');

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: emailConfig.service,
    auth: {
        user: emailConfig.usr,
        pass: emailConfig.pwd
    }
});

// api ---------------------------------------------------------------------
// get 12 recipes
app.get('/api/recipes', function(req, res) {

	// use mongoose to get all recipes in the database
	var q = Recipe.find({}).sort({ _id : "desc"}).limit(12);
	q.exec(function(err, recipes) {

		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err){
			console.log(err);
			res.send(err);
		}

		res.json(recipes); // return all recipes in JSON format
	});
});

// get 10 recipes
app.get('/api/recipes/top/:count', function(req, res) {

	// use mongoose to get all recipes in the database
	var limit = req.params.count;
	// TODO: better top results query
	var q = Recipe.find({}).limit(limit);
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

	var options = {
	    limit: 8
	}
	Recipe.textSearch(q, options, function (err, output) {
		if (err){
			console.log(err);
			res.send(err);
		}
		console.log(output);
		var list = [];
		for (var i = 0; i < output.results.length; i++) {
			list.push(output.results[i].obj);
		};
		res.json(list);
	});
});

app.post('/api/email/contactus', function(req, res) {
	var data = req.body;
	console.log("Going to send data", data);
	if(data.text != undefined && data.text.trim() != ""){
		var mailOptions = {
		    from 	: "Sarla Halal ✔ <sarla.halal@gmail.com>", // sender address
		    replyTo : data.email,
		    to 		: "shri.iitk@gmail.com", // list of receivers
		    subject : "Somebody contacted you", // Subject line
		    html 	: data.name+" said: </br>"+data.text, // html body
		    generateTextFromHTML : true
		};
		console.log("Using mailOptions ", mailOptions);
		var msg = {};
		msg.errors = {};
		// Emailid validation regex
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		if(data.name.trim().length < 5){
			msg.errors.status = true;
			msg.errors.name = "Name length must be more than 5 letters";
		}
		if(data.text.trim().length < 10){
			msg.errors.status = true;
			msg.errors.errorText = "Message length must be more than 10 letters";
		}
		if(!re.test(data.email)){
			msg.errors.status = true;
			msg.errors.email = "Invalid email address";
		}

		if(msg.errors.status){
			msg.success = false;
			msg.text = "Validation Failure";
			res.send(msg);
		}
		// send mail with defined transport object
		smtpTransport.sendMail(mailOptions, function(error, response){
			
		    if(error){
		        console.log(error);
		        //res.status(error.status || 500);
		        msg.success = false;
		        msg.text = "Error sending message : "+JSON.stringify(error.code);
		    }else{
		        console.log("Message sent: " + response.message);
		        msg.success = true;
		        msg.text = "Success";
		    }
		    console.log("Sending response", msg);
		    res.send(msg);
		});
	}
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