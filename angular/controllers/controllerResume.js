
app.controller('resumeCtrl', ['$scope',  function ( $scope ) {

  $scope.arrayByGroups = [];
  $scope.peopleGroups = {};
  $scope.peopleGroupsAmounts = {};


  $scope.setGroups = function () {
    var temporalGroups = {};
    var temporalGroupsAmounts = {};
    for( var i = 0; i < $scope.expenses.length; i++ ) {
      /*TODO: if ( $scope.expenses[i].users.length === $scope.availableUsers.length ){
        $scope.expenses[i].users = 'All';
      }*/
      if ( temporalGroups[$scope.expenses[i].users.toString()] === undefined ){

        temporalGroups[ $scope.expenses[i].users.toString() ] = [
            {
              title: $scope.expenses[i].title,
              from : $scope.expenses[i].from,
              amount: $scope.expenses[i].amount
            }
        ];

        // TODO: Set Group Total amount
        temporalGroupsAmounts[ $scope.expenses[i].users.toString()] = $scope.expenses[i].amount;

      }
      else {
        temporalGroups[ $scope.expenses[i].users.toString() ].push(
            {
              title: $scope.expenses[i].title ,
              from : $scope.expenses[i].from,
              amount: $scope.expenses[i].amount
            }
          );


        // TODO: Add Group Total amount
        temporalGroupsAmounts[ $scope.expenses[i].users.toString() ] += $scope.expenses[i].amount;
      }

      temporalGroups[ $scope.expenses[i].users.toString() ]

    }

    $scope.peopleGroups = temporalGroups;
    $scope.peopleGroupsAmounts = temporalGroupsAmounts;
    console.log($scope.peopleGroupsAmounts);

  }

  $scope.getOwedMoneyFromBy = function ( by ) {
    var owesTo = {};
    for ( var i = 0; i < $scope.expenses.length; i++ ) {
      // IF owe from this expense
      if ( $scope.expenses[i].users.indexOf( by ) !== -1  ) {
        //console.log(by, 'owes at', $scope.expenses[i].title, $scope.expenses[i].users );

        if ( owesTo[$scope.expenses[i].from] === undefined ) {
          owesTo[$scope.expenses[i].from] = Math.round($scope.expenses[i].amount / $scope.expenses[i].users.length);
        }
        else {
          owesTo[$scope.expenses[i].from] += Math.round($scope.expenses[i].amount / $scope.expenses[i].users.length);
        }

      }
    }

    return owesTo;
  }

  $scope.setGroups();

  $scope.setFinalTotalsPayTo = function ( ) {
    $scope.owesTo = {};
    for (var i = 0; i < $scope.availableUsers.length; i++) {
      $scope.owesTo[$scope.availableUsers[i].name] = $scope.getOwedMoneyFromBy($scope.availableUsers[i].name);
    }
    console.log('Owes to:', $scope.owesTo);

    $scope.finalTotals = {};
    for (var person in $scope.owesTo) {
      $scope.finalTotals[person] = {};
      for (var owingTo in $scope.owesTo[person]) {
        $scope.finalTotals[person][owingTo] = $scope.owesTo[person][owingTo];
        // console.log(person, 'owes to', owingTo);
        if ( $scope.owesTo[owingTo][person] ) {
          // console.log(owingTo, 'also owes to', person);
          $scope.finalTotals[person][owingTo]-=$scope.owesTo[owingTo][person];
          // If person doesnt owe, remove it
          if ( $scope.finalTotals[person][owingTo] <= 0 ) delete $scope.finalTotals[person][owingTo];
        }
      }

    }
    // Trimg peopile who dows not owe
    for (var person in $scope.finalTotals) {
      if ( Object.keys($scope.finalTotals[person]).length === 0 ) delete $scope.finalTotals[person];
    }

    console.log('Final totals:', $scope.finalTotals);



  }
  $scope.setFinalTotalsPayTo();

  $scope.exportResumeFor = function () {

    var resumeName =  $('#selectBy').val();
    if ( resumeName === '' ) {
      if ( $('#fileName').val().length === 0 ) {
        resumeName = 'DashBoard';
      }
      else {
        resumeName = $('#fileName').val();
      }

    }
    else {
      if (  $('#fileName').val().length === 0 ) {
        resumeName =  'Resume_' + resumeName.split(':')[1];
      }
      else {
        resumeName =   $('#fileName').val() + '_' + resumeName.split(':')[1];
      }

    }


    html2canvas($("#dashboardResume"), {
        onrendered: function(canvas) {
            theCanvas = canvas;
            canvas.toBlob(function(blob) {
                saveAs(blob, resumeName + ".png");
            });
        }
    });

  };

  // Signal --------------------------------------------------------------------
  $scope.$on('readedDataFile', function(event, args) {
    console.log('Update Resume at Readed File ');
    $scope.setGroups();
    $scope.setFinalTotalsPayTo();
    $scope.$apply();
  });

}]);
