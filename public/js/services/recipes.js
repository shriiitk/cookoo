angular.module('recipeService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Recipes', function($http) {
		return {
			get : function() {
				return $http.get('/api/recipes?t='+new Date().getTime());
			},
			findOne : function(id) {
				return $http.get('/api/recipes/details/'+id);
			},
			random : function() {
				return $http.get('/api/recipes/random?t='+new Date().getTime());
			},
			getVideos : function(name) {
				return $http.get('/api/recipes/videos/'+name);
			},
			top : function(count) {
				return $http.get('/api/recipes/top/'+count);
			},
			search : function(q, sort, start, rows) {
				return $http.get('/api/recipes/search?q='+q);
			},
			contactus	: function(jsondata) {
				return $http({
			        method  : 'POST',
			        url     : '/api/email/contactus',
			        data    : jsondata,  // pass in data as strings
			        headers : { 'Content-Type': 'application/json' }
			    });
			},
			getTags : function(count) {
				return $http.get('/api/tags/top/'+count);
			}
		}
	});