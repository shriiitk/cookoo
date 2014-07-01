// js/controllers/main.js
angular.module('recipeController', [])

	// inject the Recipe service factory into our controller
	.controller('mainController', function($scope, $http, $location, Recipes) {
		$scope.formData = {};

		$scope.goNext = function (hash) { 
			$location.path(hash);
		}

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

		$scope.searchRecipes = function() {
			console.log("Searching");
			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			// people can't just hold enter to keep adding the same to-do anymore
			if (!$.isEmptyObject($scope.formData)) {
				console.log("FORMDATA", $scope.formData);
				// call the search function from our service (returns a promise object)
				Recipes.search($scope.formData.text)

					// if successful creation, call our get function to get all the new recipes
					.success(function(data) {
						console.log("DATA", data);
						$scope.formData = {}; // clear the form so our user is ready to enter another
						$scope.searchResults = data; // assign our new list of recipes
						$scope.goNext("/search");
					});
			}
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
		/*
		// CREATE ==================================================================
		// when submitting the add form, send the text to the node API
		$scope.createTodo = function() {
			console.log("create");
			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			// people can't just hold enter to keep adding the same to-do anymore
			if (!$.isEmptyObject($scope.formData)) {

				// call the create function from our service (returns a promise object)
				Todos.create($scope.formData)

					// if successful creation, call our get function to get all the new todos
					.success(function(data) {
						$scope.formData = {}; // clear the form so our user is ready to enter another
						$scope.todos = data; // assign our new list of todos
					});
			}
		};

		// DELETE ==================================================================
		// delete a todo after checking it
		$scope.deleteTodo = function(id) {
			Todos.delete(id)
				// if successful creation, call our get function to get all the new todos
				.success(function(data) {
					$scope.todos = data; // assign our new list of todos
				});
		};
		*/
	});
