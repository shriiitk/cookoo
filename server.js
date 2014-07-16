// server.js

// set up ========================
var express    = require('express');
var app        = module.exports = express(); 			// create our app w/ express
var mongoose   = require('mongoose');					// mongoose for mongodb
var textSearch = require('mongoose-text-search');
var port       = process.env.PORT || 8000; 

// configuration =================
var database = require('./config/database');

mongoose.connect(database.url); 	// connect to mongoDB database on modulus.io

app.configure(function() {
	// Here we require the prerender middleware that will handle requests from Search Engine crawlers
  	// We set the token only if we're using the Prerender.io service
  	app.use(require('prerender-node').set('prerenderToken', 'Iohp6sfs6qMGe4UhjCoJ'));
	app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
	app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
	app.use(express.logger('dev')); 						// log every request to the console
	app.use(express.bodyParser()); 							// pull information from html in POST
});

// routes ======================================================================
// load the routes
require('./app/routes');
	
// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port "+port);