app.controller('usersCtrl', ['$scope',  function ( $scope ) {

    $scope.currentUserName = '';

    $scope.addUser = function (  ) {
      var user = $scope.currentUserName;

      for( var i = 0; i  < $scope.availableUsers.length; i++ ) {
        if ( $scope.availableUsers[i].name === user ) {
          $scope.requestSucces = false;
          console.error('User already In');
          return;
        }
      }
      $scope.requestSucces = true;
      $scope.availableUsers.push( { name: user } );
      $scope.currentUserName = '';
      displayResponse();
      $('#userName').focus();
      $scope.$emit('dataChanged', ['args']);


    }




}]);
