// js/controllers/main.js
var controllerModule = angular.module('recipeController', []);

	// inject the Recipe service factory into our controller
controllerModule.controller('mainController', function($scope, $http, $location, $anchorScroll, $window, Recipes) {
		$scope.formData = {};
		// We will create an seo variable on the scope and decide which fields we want to populate
	    $scope.seo = {
	        pageTitle : 'Recipes to cook',
	        pageDescription : 'Desicion helper for all foodies who like to cook new recipes'
	    };
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

		// GET =====================================================================
		// when landing on the page, get all recipes and show them
		// use the service to get all the recipes
		Recipes.get()
			.success(function(data) {
				// console.log(data.length);
				$scope.recipes = data;
			});

		Recipes.top(8)
			.success(function(topdata) {
				// console.log(topdata);
				$scope.top = topdata;
			});

		Recipes.getTags(20)
			.success(function(tagdata) {
				// console.log(tagdata);
				$scope.tags = tagdata;
			});

		$scope.searchRecipes = function() {
			console.log("Searching");
			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			// people can't just hold enter to keep adding the same to-do anymore
			if (!$.isEmptyObject($scope.formData)) {
				$scope.changeLocation("/search/"+$scope.formData.text);
				$scope.scrollToLocation("results");
			}
		};

		$scope.triggerSearch = function($event) {
			console.log("triggerSearch", $event.target.innerText);
			$scope.formData.text = $event.target.innerText;
			$scope.pageTitle = $scope.formData.text + " Recipes";
			$scope.searchRecipes();
			$scope.scrollToLocation("results");
		};

		$scope.triggerDetails = function($event) {
			console.log("triggerDetails", $event.target.title, $event.target.id);
			$scope.changeLocation("/recipe/"+encodeURIComponent($event.target.title)+"/"+$event.target.id);
			$scope.scrollToLocation("results");
			$scope.pageTitle = $event.target.title + " Recipe";
		};

		$scope.getRandom = function() {
			Recipes.random()
				.success(function(data) {
					console.log("random data", data);
					$scope.changeLocation("/recipe/"+encodeURIComponent(data[0].title)+"/"+data[0]._id);
					$scope.scrollToLocation("results");
				});
		};
		// Trigger seach when enter is pressed
		$scope.myFunct = function(ev) {
			if (ev.which==13){
				$scope.searchRecipes();
			}
		}

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

		$scope.scrollToLocation = function(id) {
			var element = document.getElementById(id);
			var alignWithTop = true;
			element.scrollIntoView(alignWithTop);
		}
	});

controllerModule.controller('searchController', function($scope, $http, $location, $rootScope, $window, Recipes) {
	// console.log("$scope is",$scope);
	// console.log("$location is",$location);
	var q = $scope.formData.text;
	if(q == undefined || q === '' ){
		q = $location.path();
		q = q.substring(q.lastIndexOf("/")+1);
		if(q != undefined || q != '' ){
			$scope.formData.text = q;
		}
	}
	$scope.pageTitle = q + " Recipes";
	console.log("Searching "+q);
	Recipes.search(q)
		// if successful creation, call our get function to get all the new recipes
		.success(function(data) {
			$scope.searchResults = data; // assign our new list of recipes
			console.log("Search results", data);
		});
});

controllerModule.controller('detailsController', function($scope, $http, $location, $rootScope, $window, $sce, Recipes) {
	console.log("$location is",$location);
	var q = $location.path();
	var id = q.substring(q.lastIndexOf("/")+1);
	console.log("id is "+id);
	Recipes.findOne(id)
		.success(function(data) {
			console.log("yoohooo", data);
			$scope.recipe = data; // assign our new list of recipes
			console.log("title",data.title);
			$scope.pageTitle = data.title + " Recipe";
			Recipes.getVideos(data.title)
				.success(function(results) {
					console.log("youtube", results);
					
					var videos = [];
					for(var i=0; i< results.items.length; i++){
						videos.push($sce.trustAsResourceUrl("http://www.youtube.com/embed/"+results.items[i].id.videoId));
					}
					console.log(videos);
					$scope.videos = videos;
				});
		});
});


