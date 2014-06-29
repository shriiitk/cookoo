// js/controllers/main.js
angular.module('recipeController', [])

	// inject the Todo service factory into our controller
	.controller('mainController', function($scope, $http, Recipes) {
		$scope.formData = {};

		// GET =====================================================================
		// when landing on the page, get all todos and show them
		// use the service to get all the todos
		Recipes.get()
			.success(function(data) {
				console.log(data);
				$scope.recipes = data;
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

					// if successful creation, call our get function to get all the new todos
					.success(function(data) {
						console.log("DATA", data);
						$scope.formData = {}; // clear the form so our user is ready to enter another
						$scope.recipes = data; // assign our new list of todos
					});
			}
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
