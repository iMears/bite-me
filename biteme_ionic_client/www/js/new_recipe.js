angular.module('starter.recipe.controllers')

  .controller('NewRecipeCtrl', function($scope, $http, $localStorage, $location) {
    $scope.saveRecipeCustom = function(recipe) {
      var formattedInstructions = []
      recipe.instructions.forEach(function(instructionObject){
        formattedInstructions.push(instructionObject.content)
      })

      recipe.instructions = formattedInstructions

      $http.post('http://bite-me-server.herokuapp.com/users/' + $localStorage.userID + '/recipes/custom', { recipeToAdd: recipe })
        .success(function(data) {
          $scope.saved = true;
          $location.path('/user')
        })
    }

    $scope.newCustomRecipe = {
      title: '',
      description: '',
      cuisine: '',
      ingredientsVerbose: [{'id': '1',
                            Name: '',
                            Quantity:'',
                            Unit: '',
                            PreparationNotes: ''}],
      instructions: [{'id': '1',
                    content: '' }],
      imageURL: '',
      servings: {
        yieldNumber: '',
        yieldUnit: ''
      }
    }

    $scope.addNewIngredient = function() {
      var newItemNo = $scope.newCustomRecipe.ingredientsVerbose.length+1;
      $scope.newCustomRecipe.ingredientsVerbose.push({'id': newItemNo,
                          Name: '',
                          Quantity:'',
                          Unit: '',
                          PreparationNotes: ''
        });
    };

    $scope.showAddIngredient = function(ingredient) {
      return ingredient.id === $scope.newCustomRecipe.ingredientsVerbose[$scope.newCustomRecipe.ingredientsVerbose.length-1].id;
    };


    $scope.addNewInstruction = function() {
      var newItemNo = $scope.newCustomRecipe.instructions.length+1;
      $scope.newCustomRecipe.instructions.push({'id': newItemNo,
                            content: '' });
    };

    $scope.showAddInstruction = function(instruction) {
      console.log(instruction)
      return instruction.id === $scope.newCustomRecipe.instructions[$scope.newCustomRecipe.instructions.length-1].id;
    };
  })