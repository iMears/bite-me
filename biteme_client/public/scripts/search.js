angular.module('search.controllers', [])

  .controller('SearchFormCtrl', function($scope, $http, $stateParams) {
    $scope
  })

  .controller('SearchResultCtrl', function($scope, $http, $stateParams) {
    $scope.searches = [];

    $scope.newSearch = { term: '' };

    $scope.getSearchResults = function() {
      $http.get('http://bite-me-server.herokuapp.com/recipes/search?term=' + $scope.newSearch.term)
      .success(function(data) { $scope.recipes = data; })
      .error(function(data) { console.log('Error: ' + data) })
    }
  })