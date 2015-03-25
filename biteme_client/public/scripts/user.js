angular.module('user.controllers', [])

  .controller('UserCtrl', function($scope, $http, $stateParams, $localStorage) {
    $http.get('http://bite-me-server.herokuapp.com/users/' + $localStorage.userID)
      .success(function(data) {
        $scope.user = data.data;
      })
      .error(function(data) { console.log('Error: ' + data); })
    $http.get('http://bite-me-server.herokuapp.com/admin/users/' + $localStorage.userID + '/recipes')
      .success(function(data) {
        $scope.recipes = [];
        $scope.customRecipes = [];
        for (i = 0; i < data.recipes.length; i++) {
          if (data.recipes[i].customRecipe === true) {
            $scope.customRecipes.push(data.recipes[i]);
          } else {
            $scope.recipes.push(data.recipes[i]);
          }
        }
      })
  })