angular.module('starter.auth.controllers', ['ngStorage', 'ngCordova', 'ngCordovaOauth'])

  .controller('AuthCtrl', ['$scope', '$http','$localStorage', '$location', '$window', '$cordovaOauth', function($scope, $http, $localStorage, $location, $window, $cordovaOauth) {
    if ($localStorage.userID) { $location.path('/search'); };

    $scope.login = function() {
      $cordovaOauth.facebook("602863053149140", ["email"]).then(function(result) {
        var url = "http://bite-me-server.herokuapp.com/fb_get_token?access_token=" + encodeURIComponent(result.access_token);
        console.log("Fetching " + url);
        $http.get(url)
          .success(function(res, body) {
            console.log(JSON.stringify(res));
            $localStorage.userID = res.id;
            $localStorage.token = res.token;
            $location.path('/search');
          })
          .error(function() {
            // error
          });
      }, function(error) {
        // error
      });
    };

    $scope.userLoggedIn = function() {
      if ($localStorage.userID) { return true; }
      else { return false; }
    }
  }]);