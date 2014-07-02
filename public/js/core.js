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

});

/*
// CONTROLLERS ============================================
// home page controller
animateApp.controller('mainController', function($scope) {
    $scope.pageClass = 'page-home';
});

// about page controller
animateApp.controller('aboutController', function($scope) {
    $scope.pageClass = 'page-about';
});

// contact page controller
animateApp.controller('contactController', function($scope) {
    $scope.pageClass = 'page-contact';
});
*/