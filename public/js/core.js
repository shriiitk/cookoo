var app = angular.module('cookoo', ['recipeController', 'recipeService', 'ngRoute', 'ngAnimate']);

// ROUTING ===============================================
// set our routing for this application
// each route will pull in a different controller
app.config(function($routeProvider, $locationProvider) {

    $routeProvider

    	// home page
    	.when("/", {
    		templateUrl	: "partials/results.html",
            controller 	: "mainController"
    	})
    	.when("/search/:q", {
    		templateUrl	: "partials/search.html",
            controller 	: "searchController"
    	})
        .when("/recipe/:name/:id", {
            templateUrl : "partials/recipe.html",
            controller  : "detailsController"
        })
    	.otherwise({
		    redirectTo: "/"
		});
    	/*
    	// about page
    	.when('/about', {
    		templateUrl: 'page-about.html',
            controller: 'aboutController'
    	})

    	// contact page
    	.when('/contact', {
    		templateUrl: 'page-contact.html',
            controller: 'contactController'
    	})
    	;*/
        // $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');

});