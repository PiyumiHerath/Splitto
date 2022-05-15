var app = angular.module('gastosApp',[ 'ngRoute', 'ngTouch', 'ui.mask' , 'angucomplete' ]);
// Generic Functions & Events --------------------------------------------------
var dataChanged = false;
var expenses;
function displayResponse(  ) {
  $('#actionResponse').slideDown(350, function () {
    setTimeout(function () {
      $('#actionResponse').slideUp(150);
    }, 1200);
  });
}

window.onbeforeunload = function(e) {
  if ( dataChanged === true ) {
    var dialogText = 'You are leaving without saving your data. ¿Do you still want to leave?';
    e.returnValue = dialogText;
    return dialogText;

  }
  else {
    e.preventDefault();
  }

};




app.controller('mainCtrl', [ '$scope', function( $scope ){

  $scope.navBar  = 'angular/views/navbar.html';
  $scope.sideNav = 'angular/views/sidenav.html';
  $scope.fileName = '';
  // Global Data ---------------------------------------------------------------
  $scope.availableUsers   = [

  ];
  $scope.expenses = [];
  $scope.owesTo = {};
  $scope.finalTotals = {  }

  // Global Funcions -----------------------------------------------------------
  $scope.saveLocalData = function () {
    console.log($scope.expenses);
    alasql("SELECT * INTO CSV('" + $scope.fileName + ".csv') FROM ?", [$scope.expenses]);
    $scope.$broadcast('dataChanged', [false]);

  }
  $scope.saveLocalDataAs = function () {
    console.log($scope.expenses);
    alasql("SELECT * INTO CSV('" + $('#fileName').val() + ".csv') FROM ?", [$scope.expenses]);
    $scope.fileName = $('#fileName').val();
    $('.inputFile').val('');
    $scope.$broadcast('dataChanged', [false]);

  }
  $scope.loadLocalData = function ( event ) {
    console.log(event);
    $('#fileName').val(event.target.files[0].name.split('.')[0]);
    alasql('SELECT * FROM CSV(?,{headers:true, separator:";"})',[event.originalEvent],function(data){
      // Get expenses
      console.info(data);
      var temp = [];
      var totalUsersAsStringArray = [];
      for ( var i = 0; i < data.length; i++ ){

        data[i].id = i + 1 ;

        temp = data[i].users.split(',');
        data[i].users = temp;

        // Look up for users
        for ( var j = 0; j < temp.length; j++ ) {
          if ( totalUsersAsStringArray.indexOf(temp[j]) === -1 ) {
            totalUsersAsStringArray.push( temp[j] );
          }
        }
      }
      var totalUsersAsObjects = [];
      for ( var i = 0; i < totalUsersAsStringArray.length; i++ ) {
        totalUsersAsObjects.push( { name: totalUsersAsStringArray[i] } );
      }

      // Update Scope Vars
      $scope.availableUsers = totalUsersAsObjects;
      $scope.expenses = data;
      $scope.fileName = $('#fileName').val();

      // Update
      $scope.$broadcast('readedDataFile', ['args']);
      $scope.$broadcast('dataChanged', [false]);

      $scope.$apply();
    });
  }

  // Calculate -----------------------------------------------------------------
  $scope.getTotalAmount = function () {
    var total = 0;
    for ( var i = 0; i < $scope.expenses.length; i++ ) {
      total += parseInt($scope.expenses[i].amount);
    }
    return total;
  };
  $scope.getSpentMoneyFrom = function ( user ) {
    var total = 0;
    for ( var i = 0; i < $scope.expenses.length; i++ ) {
      if ( $scope.expenses[i].from === user ){
        total += $scope.expenses[i].amount;
      }
    }
    return total;

  }

  // Signalks ------------------------------------------------------------------
  $scope.$on('dataChanged', function(event, args) {
    if ( args[0] === false ) {
      dataChanged = false;
      document.title = 'Splitto';
    }
    else {
      dataChanged = true;
      document.title = 'Splitto*';
    }

  });


}]);

app.directive('customOnChange', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var onChangeFunc = scope.$eval( attrs.customOnChange );
      element.bind('change', function(event){
			onChangeFunc(event);//files);
      });

      element.bind('click', function(){
      	element.val('');
      });
    }
  };
});
