angular.module('recipeService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Recipes', function($http) {
		return {
			get : function() {
				return $http.get('/api/recipes');
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
			}
			/*,
			create : function(todoData) {
				return $http.post('/api/todos', todoData);
			},
			delete : function(id) {
				return $http.delete('/api/todos/' + id);
			}*/
		}
	});