angular.module('BiteMe', [ 'auth.controllers',
                           'ngStorage',
                           'recipe.controllers',
                           'search.controllers',
                           'user.controllers',
                           'ui.router' ])

  .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {

    $stateProvider

    .state('home', {
      url: '/',
      templateUrl: 'partials/authentication.html',
      controller: 'AuthCtrl as a'
    })

    .state('new_recipe', {
      url: '/recipes/new',
      templateUrl: 'partials/new_recipe.html',
      controller: 'NewRecipeCtrl as nr'
    })

    .state('search_results', {
      url: '/search_results',
      templateUrl: 'partials/search_results.html',
      controller: 'SearchResultCtrl as sr'
    })

    .state('recipe', {
      url: '/recipes/:recipeId',
      templateUrl: 'partials/recipe_show.html',
      controller: 'RecipeCtrl as r'
    })

    .state('user', {
      url: '/user',
      templateUrl: 'partials/user_show.html',
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