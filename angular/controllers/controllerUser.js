app.controller('userCtrl', ['$scope', '$routeParams',  function ( $scope, $routeParams ) {

    $scope.originalUserName =  $routeParams.user;
    $scope.currentUserName = $routeParams.user;

    $scope.updateUser = function ( ) {

      // Check if name doen's exit
      if ( validateIfUserOwnsOrHasExpenses() ){
        return;
      }

      // Edit
      // Update from expenses
      for ( var i = 0; i < $scope.expenses.length; i++ ) {
        if ( $scope.expenses[i].from === $scope.originalUserName  ) {
          $scope.expenses[i].from = $scope.currentUserName;
        }
        for ( var j = 0; j < $scope.expenses[j].users.length; j++ ) {
          if ( $scope.expenses[i].users[j] === $scope.originalUserName  ) {
            $scope.expenses[i].users[j] = $scope.currentUserName;
          }
        }
      }
      // Update from available Users
      for ( var i = 0; i < $scope.availableUsers.length; i++ ) {
        if ( $scope.availableUsers[i].name === $scope.originalUserName ) {
          $scope.availableUsers[i].name = $scope.currentUserName;
          console.info('Updated');
          break;
        }
      }

      console.info('Done');
      $scope.$emit('dataChanged', ['args']);

      $scope.requestSucces = true;
      displayResponse();
      window.location = '#!/users';





    }
    $scope.deleteUser = function ( ) {
      // Check if name doen's exit
      if ( validateIfUserOwnsOrHasExpenses() ){
        return;
      }

      for ( var i = 0; i < $scope.availableUsers.length; i++ ) {
        if ( $scope.availableUsers[i].name ===   $scope.originalUserName ) {
          $scope.availableUsers.splice(i,1);
          console.info('Removed');
          break;
        }
      }

      console.info('Done');
      $scope.$emit('dataChanged', ['args']);

      $scope.requestSucces = true;
      displayResponse();
      window.location = '#!/users';



    }

    function validateIfUserOwnsOrHasExpenses( ) {

      for ( var i = 0; i < $scope.expenses.length; i++ ) {
        /*if ( $scope.expenses[i].from === $scope.originalUserName  ) {
          console.error('Person owns expenses');
          return true;
        } else*/
        if ( $scope.expenses[i].from === $scope.currentUserName  ) {
          $scope.requestSucces = false;
          displayResponse();
          console.error('New Person name already In');
          return true;
        }
        for ( var j = 0; j < $scope.expenses[j].users; j++ ) {
          /*if ( $scope.expenses[i].users[j] === $scope.originalUserName  ) {
            console.error('Person has expenses');
            return true;
          } else*/
          if ( $scope.expenses[i].users[j] === $scope.currentUserName  ) {
            $scope.requestSucces = false;
            displayResponse();
            console.error('New Person name already In');
            return true;
          }
        }
      }

      return false;

    }



}]);
