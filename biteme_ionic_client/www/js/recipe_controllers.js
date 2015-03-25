angular.module('starter.recipe.controllers', [])

  .controller('RecipeCtrl', function($scope, $http, $stateParams, $interval, $timeout, $localStorage, $ionicScrollDelegate, $location) {
    // formatting functions
    $scope.formatIngredients = function(multiplier) {
      var formattedIngredients = [];
      var multiplier = multiplier || $scope.recipe.servings.yieldNumber;
      var ingredients = $scope.recipe.ingredientsVerbose;
      for (i = 0; i < ingredients.length; i++) {
        var quantity = Ratio.parse(ingredients[i].Quantity / multiplier * $scope.recipe.servings.yieldNumber).simplify().toLocaleString().trim();
        var unitType = ingredients[i].Unit || '';
        var name = ingredients[i].Name.toLowerCase().trim();
        var prep = ingredients[i].PreparationNotes || '';
        if (prep === '') {
          formattedIngredients.push(quantity + ' ' + unitType.toLowerCase().trim() + ' ' + name);
        } else {
          formattedIngredients.push(quantity + ' ' + unitType.toLowerCase().trim() + ' ' + name + ' (' + prep.toLowerCase().trim() + ')');
        }
      }
      return formattedIngredients;
    };

    $scope.formatInstructions = function() {
      var formattedInstructions = [];
      var instructions = $scope.recipe.instructions;
      for (i = 0; i < instructions.length; i++) {
        var instruction = instructions[i].toLowerCase().trim();
        if (instruction.length > 2) { formattedInstructions.push(instruction.charAt(0).toUpperCase() + instruction.slice(1)); };
      }
      return formattedInstructions;
    };

    // get request
    if ($location.search().custom === 'true') {
      url = 'http://bite-me-server.herokuapp.com/users/' + $localStorage.userID + '/customrecipe/' + $stateParams.recipeId;
    } else {
      url = 'http://bite-me-server.herokuapp.com/recipes/' + $stateParams.recipeId;
    };
    $http.get(url)
      .success(function(data) {
        $scope.recipe = data;
        $scope.ingredients = $scope.formatIngredients();
        $scope.instructions = $scope.formatInstructions();
        $scope.numServings = data.servings.yieldNumber;
        $scope.saved = false;
      })
    .error(function(data) { console.log('Error: ' + data); })

    // save recipe
    $scope.saveRecipe = function() {
      $http.post('http://bite-me-server.herokuapp.com/users/' + $localStorage.userID + '/recipes', { recipeToAdd: $scope.recipe.recipeID })
        .success(function(data) { $scope.saved = true; })
    };

    // scrolling function
    $scope.scrollTop = function() {
      $ionicScrollDelegate.scrollTop();
    };

    // update servings
    $scope.updateServings = function() {
      $scope.ingredients = $scope.formatIngredients($scope.numServings);
    }

    // voice start/stop functions
    $scope.inProgress = false;

    $scope.startCaesar = function() {
      $scope.inProgress = true;
      $scope.scrollTop();
      // $scope.activateCaesar('Caesar here, at your service.');
      $scope.activateCaesar("Let's begin.");
      $timeout( function(){ $scope.activateCaesar('Your first step is:'); }, 1800);
      $timeout( function(){ $scope.activateCaesar($scope.findStep()); }, 3400);
      annyang.start();
    };

    $scope.stopCaesar = function() {
      $scope.inProgress = false;
      $scope.activateCaesar('');
      annyang.stop();
    };

    // recipe queries
    $scope.currentStep = 0;

    $scope.incrementStep = function() {
      $scope.currentStep++;
    };

    $scope.findStep = function() {
      return $scope.instructions[$scope.currentStep]
    };

    $scope.findIngredient = function(inputIngredient) {
      var ingredients = $scope.ingredients;
      for (var key in ingredients) {
        if (ingredients[key].toLowerCase().indexOf(inputIngredient.toLowerCase()) >= 0) {
          return ingredients[key];
          break;
        }
      }
      return "I'm sorry. I do not see " + inputIngredient + " in this recipe."
    };

    // caesar response functions
    $scope.caesarSpeech = '';

    $scope.activateCaesar = function(str) {
      $scope.setTextArea(str);
      $scope.$apply();
      $scope.triggerCaesar();
    };

    $scope.setTextArea = function(str) {
      $scope.caesarSpeech = str;
    };

    $scope.triggerCaesar = function() {
      $('#textToSpeech input').trigger('click');
    }; // put into angular speak

    // set timer
    $scope.invisibleTimer = true;

    $scope.setTimer = function(time) {
      $scope.invisibleTimer = false;

      $scope.seconds = time * 60;

      function runTimer() {
        if ($scope.seconds === 0) {
          $scope.invisibleTimer = true;
          $scope.activateCaesar('Your timer has expired.');
          $interval.cancel(startTimer);
        } else {
          $scope.seconds--;
        };
      }

      startTimer = $interval(runTimer, 1000);
    };

    // caesar commands
    if (annyang) {
      var commands = {
        // basic commands
        'hey caesar': function() {
          $scope.activateCaesar('Caesar here, at your service.');
          // possible need to restart annyang here
        },
        'caesar': function() {
          $scope.activateCaesar('Caesar here, at your service.');
        },
        'thank you caesar': function() {
          $scope.activateCaesar("You're quite welcome.");
        },
        'thank you': function() {
          $scope.activateCaesar("You're quite welcome.");
        },
        'thanks caesar': function() {
          $scope.activateCaesar("You're quite welcome.");
        },
        'thanks': function() {
          $scope.activateCaesar("You're quite welcome.");
        },

        // session commands
        'goodbye caesar': function() {
          $scope.activateCaesar('Ta ta for now.');
          $timeout( function(){ $scope.stopCaesar(); }, 2500);
        },
        'goodbye': function() {
          $scope.activateCaesar('Ta ta for now.');
          $timeout( function(){ $scope.stopCaesar(); }, 2500);
        },
        'caesar help': function() {
          $scope.activateCaesar('How can I be of assistance?')
          $timeout( function(){ $scope.activateCaesar('You can say things like:'); }, 2300);
          $timeout( function(){ $scope.activateCaesar("'Next step',"); }, 4100);
          $timeout( function(){ $scope.activateCaesar("'Repeat step',"); }, 5100);
          $timeout( function(){ $scope.activateCaesar("'How much cardamom?',"); }, 6100);
          $timeout( function(){ $scope.activateCaesar("Or, 'Set a timer for twenty minutes.'"); }, 7600);
        },
        'help caesar': function() {
          $scope.activateCaesar('How can I be of assistance?')
          $timeout( function(){ $scope.activateCaesar('You can say things like:'); }, 2300);
          $timeout( function(){ $scope.activateCaesar("'Next step',"); }, 4100);
          $timeout( function(){ $scope.activateCaesar("'Repeat step',"); }, 5100);
          $timeout( function(){ $scope.activateCaesar("'How much cardamom?',"); }, 6100);
          $timeout( function(){ $scope.activateCaesar("Or, 'Set a timer for twenty minutes.'"); }, 7600);
        },
        'help': function() {
          $scope.activateCaesar('How can I be of assistance?')
          $timeout( function(){ $scope.activateCaesar('You can say things like:'); }, 2300);
          $timeout( function(){ $scope.activateCaesar("'Next step',"); }, 4100);
          $timeout( function(){ $scope.activateCaesar("'Repeat step',"); }, 5100);
          $timeout( function(){ $scope.activateCaesar("'How much cardamom?',"); }, 6100);
          $timeout( function(){ $scope.activateCaesar("Or, 'Set a timer for twenty minutes.'"); }, 7600);
        },

        // step commands
        // add previous step function
        'caesar next step': function() {
          $scope.incrementStep();
          $scope.activateCaesar($scope.findStep());
        },
        'next step': function() {
          $scope.incrementStep();
          $scope.activateCaesar($scope.findStep());
        },
        'caesar repeat step': function() {
          $scope.activateCaesar($scope.findStep());
        },
        'repeat step': function() {
          $scope.activateCaesar($scope.findStep());
        },
        'caesar repeat': function() {
          $scope.activateCaesar($scope.findStep());
        },
        'repeat': function() {
          $scope.activateCaesar($scope.findStep());
        },
        'caesar repeat last step': function() {
          $scope.activateCaesar($scope.findStep());
        },
        'repeat last step': function() {
          $scope.activateCaesar($scope.findStep());
        },

        // ingredient commands
        'caesar how much *ingredient': function(ingredient) {
          $scope.activateCaesar($scope.findIngredient(ingredient));
        },
        'how much *ingredient': function(ingredient) {
          $scope.activateCaesar($scope.findIngredient(ingredient));
        },
        'caesar how many *ingredient': function(ingredient) {
          var length = ingredient.length - 1;
          if (ingredient[length] === 's') {
            ingredient = ingredient.substr(0, length);
            if (ingredient[length - 1] === 'e') {
              ingredient = ingredient.substr(0, length - 1);
            };
          };
          $scope.activateCaesar($scope.findIngredient(ingredient));
        },
        'how many *ingredient': function(ingredient) {
          var length = ingredient.length - 1;
          if (ingredient[length] === 's') { ingredient = ingredient.substr(0, length) };
          $scope.activateCaesar($scope.findIngredient(ingredient));
        },

        // timer ingredients
        'caesar set timer for *time minutes': function(minutes) {
          $scope.setTimer(minutes);
          $scope.activateCaesar('I have set the timer for ' + minutes + ' minutes.');
        },
        'set timer for *time minutes': function(minutes) {
          $scope.setTimer(minutes);
          $scope.activateCaesar('I have set the timer for ' + minutes + ' minutes.');
        },
        'caesar set a timer for *time minutes': function(minutes) {
          $scope.setTimer(minutes);
          $scope.activateCaesar('I have set the timer for ' + minutes + ' minutes.');
        },
        'set a timer for *time minutes': function(minutes) {
          $scope.setTimer(minutes);
          $scope.activateCaesar('I have set the timer for ' + minutes + ' minutes.');
        },
        'caesar set timer for *time minute': function(minutes) {
          $scope.setTimer(minutes);
          $scope.activateCaesar('I have set the timer for ' + minutes + ' minute.');
        },
        'set timer for *time minute': function(minutes) {
          $scope.setTimer(minutes);
          $scope.activateCaesar('I have set the timer for ' + minutes + ' minute.');
        },
        'caesar set a timer for *time minute': function(minutes) {
          $scope.setTimer(minutes);
          $scope.activateCaesar('I have set the timer for ' + minutes + ' minute.');
        },
        'set a timer for *time minute': function(minutes) {
          $scope.setTimer(minutes);
          $scope.activateCaesar('I have set the timer for ' + minutes + ' minute.');
        },

        // easter eggs
        'caesar what is your favorite color': function() {
          $scope.activateCaesar('Magenta, thank you for asking.');
        },
        'caesar tell me a joke': function() {
          $scope.activateCaesar('Where do animals go when their tails fall off?');
          $timeout( function(){ $scope.activateCaesar('The retail store.'); }, 5000);
        }
      };
      annyang.addCommands(commands);
    };
  })