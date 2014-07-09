var app = require('../server');
// load the todo model
var Tag = require('./models/tag');
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

var Youtube = require("youtube-api");

Youtube.authenticate({
    type: 'key',
    key: 'AIzaSyA45HAQXBU-ckD_PRwGopKM2022rxTyMVk'
});

// api ---------------------------------------------------------------------
// 
app.get('/api/recipes/videos/:name', function(req, res) {
	var name = req.params.name + " recipe";
	console.log("Searching youtube for "+name);

	Youtube.search.list({
	    "part": "id",
	    "maxResults": 4,
	    "q": name
	}, function (err, data) {
	    console.log(err, JSON.stringify(data));
	    res.json(data);
	});
});

app.get('/api/recipes/random', function(req, res) {
	var id = req.params.id;
	Recipe.count({}, function( err, count){
		if(!err){
			console.log( "Number of recipes:", count );
			var randomnumber=Math.floor(Math.random()*count);
			console.log( "Picking:", randomnumber );
			var q = Recipe.find({}).select('_id title tags').skip(randomnumber).limit(1);
			q.exec(function(err, recipes) {
				if (err){
					console.log(err);
					res.send(err);
				}
				console.log("recipes", recipes);
				res.json(recipes); // return all recipes in JSON format
			});
		}
	    
	})
});

app.get('/api/recipes/details/:id', function(req, res) {
	var id = req.params.id;
	// use mongoose to get specific recipe from the database
	var q = Recipe.findOne({ '_id': id }).select('_id title tags');
	q.exec(function(err, recipes) {

		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err){
			console.log(err);
			res.send(err);
		}
		console.log("Found", recipes);
		res.json(recipes); // return all recipes in JSON format
	});
});

app.get('/api/recipes', function(req, res) {

	// use mongoose to get all recipes in the database
	var q = Recipe.find({}).sort({ _id : "desc"}).select('_id title').limit(12);
	q.exec(function(err, recipes) {

		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err){
			console.log(err);
			res.send(err);
		}

		res.json(recipes); // return all recipes in JSON format
	});
});

app.get('/api/recipes/top/:count', function(req, res) {

	// use mongoose to get all recipes in the database
	var limit = req.params.count;
	// TODO: better top results query
	var q = Recipe.find({}).sort({instructions:-1}).select('title').limit(limit*2);
	q.exec(function(err, recipes) {

		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err){
			console.log(err);
			res.send(err);
		}
		var randomPicks = [];
		for(var i=0; i<limit; i++){
			randomPicks.push(recipes[Math.floor(Math.random() * recipes.length)]);
		}
		res.json(randomPicks); // return all recipes in JSON format
	});
});

app.get('/api/tags/top/:count', function(req, res) {

	// use mongoose to get all tags in the database
	var limit = req.params.count;
	// TODO: better top results query
	var q = Tag.find({}).select('title').limit(limit);
	q.exec(function(err, tags) {

		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err){
			console.log(err);
			res.send(err);
		}
		var randomPicks = [];
		for(var i=0; i<limit; i++){
			randomPicks.push(tags[Math.floor(Math.random() * tags.length)]);
		}
		res.json(randomPicks); // return all tags in JSON format
	});
});

app.get('/api/recipes/search', function(req, res) {

	var q = req.query.q;
	var sort = req.query.sort;
	var start = req.query.start;
	var rows = req.query.rows;

	var options = {
	    limit: 8,
	    select: "_id title tags"
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
			return;
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
		        msg.text = "Message sent Successfuly";
		    }
		    console.log("Sending response", msg);
		    res.send(msg);
		});
	}
});

// application -------------------------------------------------------------
app.get('sitemap.xml', function(req, res) {
	res.sendfile('./public/sitemap.xml');
});

app.get('*', function(req, res) {
	res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});