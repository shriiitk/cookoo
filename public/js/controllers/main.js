// js/controllers/main.js
var controllerModule = angular.module('recipeController', [])

	// inject the Recipe service factory into our controller
controllerModule.controller('mainController', function($scope, $http, $location, $anchorScroll, $window, Recipes) {
		$scope.formData = {};

		var prevPath = '';

		$scope.goNext = function (hash) { 
			$location.path(hash).replace();
			$scope.$apply();
		};

		//be sure to inject $scope and $location somewhere before this
		$scope.changeLocation = function(url, force) {
		  //this will mark the URL change
		  $location.path(url); //use $location.path(url).replace() if you want to replace the location instead

		  $scope = $scope || angular.element(document).scope();
		  if(force || !$scope.$$phase) {
		    //this will kickstart angular if to notice the change
		    $scope.$apply();
		  }
		};

		$scope.$on('$viewContentLoaded', function(event) {
			console.log("viewContentLoaded",$location.path());
			// TODO: Need better way to check if it is firing only once per action
			if($location.path() != prevPath){
				console.log("prevPath="+prevPath+" & location.path()="+$location.path())
				$window.ga('send', 'pageview', { page: $location.path() });
				if($location.absUrl().indexOf("search")){
					$window.ga('send', 'event', 'search', 'click', 'path', $location.path());
				}
				prevPath = $location.path();
			}
		});


		// $rootScope.$on('$routeChangeSuccess', function(event, curr, prev) {
		// 	console.log("routeChangeSuccess", $location.path(), event, curr, prev);
		// 	$window.ga('send', 'pageview', { page: $location.path() });
		// });

		// GET =====================================================================
		// when landing on the page, get all recipes and show them
		// use the service to get all the recipes
		Recipes.get()
			.success(function(data) {
				console.log(data.length);
				$scope.recipes = data;
			});

		Recipes.top(8)
			.success(function(topdata) {
				console.log(topdata);
				$scope.top = topdata;
			});

		Recipes.getTags(20)
			.success(function(tagdata) {
				console.log(tagdata);
				$scope.tags = tagdata;
			});

		$scope.searchRecipes = function() {
			console.log("Searching");
			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			// people can't just hold enter to keep adding the same to-do anymore
			if (!$.isEmptyObject($scope.formData)) {
				console.log("FORMDATA", $scope.formData);
				console.log("location=",$location);
				console.log("/search/"+$scope.formData.text);
				// set the location.hash to the id of
			    // the element you wish to scroll to.
			    $location.hash('results');

			    // call $anchorScroll()
			    $anchorScroll();
				//$scope.goNext("/search/"+$scope.formData.text);
				$scope.changeLocation("/search/"+$scope.formData.text);
				// call the search function from our service (returns a promise object)
				// Recipes.search($scope.formData.text)

				// 	// if successful creation, call our get function to get all the new recipes
				// 	.success(function(data) {
				// 		console.log("DATA", data, $scope.formData.text);
				// 		$scope.formData = {}; // clear the form so our user is ready to enter another
				// 		$scope.searchResults = data; // assign our new list of recipes
				// 		$scope.goNext("/search/"+$scope.formData.text);
				// 	});
			}
		};

		$scope.triggerSearch = function($event) {
			console.log("triggerSearch", $event.target.innerText);
			$scope.formData.text = $event.target.innerText;
			$scope.searchRecipes();
		};

		// process the form
		$scope.processForm = function() {
			Recipes.contactus(JSON.stringify($scope.contactFormData))
				.success(function(data, status, headers, config) {
					console.log("data is ",data, status, headers, config);
		            if (!data.success) {
		            	// if not successful, bind errors to error variables
		                $scope.errorName = data.errors.name;
		                $scope.errorEmail = data.errors.email;
		                $scope.errorText = data.errors.errorText;
		                $scope.message = data.text;
		            } else {
		            	// if successful, bind success message to message
		                $scope.message = data.text;
		                $scope.contactFormData = {};
		                $scope.errorName = "";
		                $scope.errorEmail = "";
		                $scope.errorText = "";
		            }
				})
				.error(function(data, status, headers, config) {
					console.log("Error found", data, status, headers, config);
				});
		};
	});

controllerModule.controller('searchController', function($scope, $http, $location, $rootScope, $window, Recipes) {
	console.log("$scope is",$scope);
	Recipes.search($scope.formData.text)
		// if successful creation, call our get function to get all the new recipes
		.success(function(data) {
			console.log("DATA", data);
			$scope.formData = {}; // clear the form so our user is ready to enter another
			$scope.searchResults = data; // assign our new list of recipes
			// $scope.goNext("/search");
		});
});
