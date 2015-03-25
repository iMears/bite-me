// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.auth.controllers', 'starter.recipe.controllers', 'starter.search.controllers', 'starter.user.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
   .state('home', {
      url: '/',
      templateUrl: './templates/authentication.html',
      controller: 'AuthCtrl as a'
    })

    .state('search', {
      url: '/search',
      templateUrl: './templates/search_results.html',
      controller: 'SearchResultCtrl as sr'
    })

    .state('new_recipe', {
      url: '/recipes/new',
      templateUrl: './templates/new_recipe.html',
      controller: 'NewRecipeCtrl as nr'
    })

    .state('recipe', {
      url: '/recipes/:recipeId',
      templateUrl: './templates/recipe_show.html',
      controller: 'RecipeCtrl as r'
    })

    .state('user', {
      url: '/users',
      templateUrl: './templates/user_show.html',
      controller: 'UserCtrl as u'
    })

    $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function($q, $location, $localStorage) {
      return {
        'request': function(config) {
          config.headers = config.headers || {};
          if ($localStorage.token) {
              config.headers.Authorization = 'Bearer ' + $localStorage.token;
          }
          return config;
        },
        'responseError': function(response) {
          if(response.status === 401 || response.status === 403) {
              $location.path('/signin');
          }
          return $q.reject(response);
        }
      }
    }]);

    $urlRouterProvider.otherwise('/');
  }])

  .filter('formatTime', function() {
    return function(sec) {
      var mm = Math.floor(sec / 60);
      var ss = sec - (mm * 60);

      if (mm < 10) { mm = '0' + mm; }
      if (ss < 10) { ss = '0' + ss; }

      return mm + ':' + ss;
    }
  })

  .filter('fraction', function() {
    return function(input) {
      firstSpace = input.indexOf(' ')
      num = input.substr(0, firstSpace);
      string = input.substr(firstSpace + 1);
      return Ratio.parse(num).simplify().toLocaleString() + ' ' + string;
    }
  })