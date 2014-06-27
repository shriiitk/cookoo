angular.module('recipeService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Recipes', function($http) {
		return {
			get : function() {
				return $http.get('/api/recipes');
			}/*,
			create : function(todoData) {
				return $http.post('/api/todos', todoData);
			},
			delete : function(id) {
				return $http.delete('/api/todos/' + id);
			}*/
		}
	});