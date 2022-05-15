app.config( function ($routeProvider) {

  $routeProvider
    .when('/',{
      templateUrl: 'angular/views/viewResume.html',
      controller: 'resumeCtrl'
      //controller: 'inicioCtrl'
    })
    .when('/users', {
      templateUrl: 'angular/views/viewUsers.html',
      controller: 'usersCtrl'
    })
    .when('/user/:user', {
      templateUrl: 'angular/views/viewUser.html',
      controller: 'userCtrl'
    })
    .when('/list', {
      templateUrl: 'angular/views/viewList.html',
      controller: 'listCtrl'
    })
    .otherwise({
      redirectTo: '/'
    })

});
