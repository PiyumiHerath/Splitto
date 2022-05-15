app.controller('listCtrl', ['$scope',  function ( $scope, focus ) {

  // Filtering -----------------------------------------------------------------
  $scope.order = 'id';
  $scope.ascdesc = true;


  // User Related --------------------------------------------------------------
  function updateUsers() {
    $scope.currentUsers     = angular.copy($scope.availableUsers);

    var totalUsers = $scope.currentUsers.length;
    for ( var i = 0; i < totalUsers; i++  ) {
      $scope.currentUsers.push( {name: 'No ' + $scope.currentUsers[i].name })
    }

    $scope.currentUsers.push( { name: 'All'} );

    $scope.selectedUser     = {};
  }
  $scope.removeUserFromCurrentExpense = function ( user ) {
    console.log(user);
    // Push Again to Current Users
    $scope.currentUsers.push({ name: user});
    // Remove from current Expense
    for( var i = 0; i < $scope.currentExpense.users.length; i++ ) {
      if ( $scope.currentExpense.users[i] === user ) {
        $scope.currentExpense.users.splice(i, 1);
        break;
      }
    }
    $scope.$emit('dataChanged', ['args']);

  }
  updateUsers();

  // Expenses related ----------------------------------------------------------
  $scope.currentExpense = {
    id: '',
    title: '',
    amount: '',
    from: '',
    users: [
    ]
  };
  $scope.removeExpenseFromExpenses = function ( expense ) {
    // Search by index from expenses list to remove
    for ( var i = 0; i < $scope.expenses.length; i++ ) {
      if (  $scope.expenses[i].$$hashKey === expense.$$hashKey ) {
        $scope.expenses.splice(i, 1);
        break;
      }
    }
    $scope.$emit('dataChanged', ['args']);


  };
  $scope.addCurrentExpense = function ( ) {
    console.log( $scope.currentExpense  );

    // Handle Spaecial Users
    // Handle All users
    if ( $scope.currentExpense.users.indexOf('All') !== -1 ) {
      $scope.currentExpense.users = [];
      for ( var i = 0; i <  $scope.availableUsers.length; i++ ){
        $scope.currentExpense.users.push($scope.availableUsers[i].name);
      }
    }
    else {
      for ( var i = 0; i <  $scope.currentExpense.users.length; i++ ){
        if ( $scope.currentExpense.users[i].includes('No ') ) {
          var noUser = $scope.currentExpense.users[i].split('No ')[1];
          console.log('No USer:', noUser);
          $scope.currentExpense.users = [];
          for ( var j = 0; j <  $scope.availableUsers.length; j++ ) {
            if ( $scope.availableUsers[j].name !== noUser ) {
              $scope.currentExpense.users.push($scope.availableUsers[j].name);
            }
          }

          break;
        }
      }
      $scope.$emit('dataChanged', ['args']);

    }


    $scope.currentExpense.id = $scope.expenses.length + 1;
    $scope.expenses.push( $scope.currentExpense );
    var fromActual = $scope.currentExpense.from;
    $scope.currentExpense = {
      id: '',
      title: '',
      amount: '',
      from: fromActual,
      users: [
      ]
    };


    $scope.currentUsers     = angular.copy($scope.availableUsers);
    updateUsers();

    $scope.requestSucces = true;
    displayResponse();
    $('#amount').focus();

  }

  // Signal --------------------------------------------------------------------
  $scope.$on('readedDataFile', function(event, args) {
    console.log('users Updated');
    updateUsers();
  });





}]);
