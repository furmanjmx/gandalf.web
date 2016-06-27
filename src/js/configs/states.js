angular.module('app').config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider.state('main', {

    abstract: true,
    template: '<ui-view />'
  });

  $stateProvider.state('private-load', {
    parent: 'auth',
    abstract: true,
    auth: true,
    template: '<ui-view />',
    resolve: {
      user: ['UserService','projects', function (UserService,projects) {
        return UserService.current();
      }],
      projects: ['ProjectsService','$q', '$state', function (ProjectsService, $q, $state) {
        return $q.when(ProjectsService.all()).then(function (resp) {
          if (resp.length) return resp;
          $state.go('welcome-project-add');
        });
      }]
    },
    controller: 'AppController'
  });

  $stateProvider.state('private', {
    parent: 'private-load',
    abstract: true,
    auth: true,
    templateUrl: 'templates/layouts/private.html'
  });

  $stateProvider.state('public', {
    parent: 'auth',
    abstract: true,
    auth: false,
    templateUrl: 'templates/layouts/public.html'
  });

  $stateProvider.state('sign-in', {
    parent: 'public',
    url: '/sign-in?username',
    params: {
      errorCode: null
    },
    controller: 'SignInController',
    templateUrl: 'templates/sign-in.html'
  }).state('sign-up', {
    parent: 'public',
    url: '/sign-up?username?email',
    controller: 'SignUpController',
    templateUrl: 'templates/sign-up.html'
  }).state('activate', {
    parent: 'public',
    url: '/activate/:token',
    controller: 'ActivateController',
    templateUrl: 'templates/activate.html',
    resolve: {
      user: ['UserService', 'AuthService', '$state', '$stateParams', function (UserService, AuthService, $state, $stateParams) {
        return UserService.verifyEmail($stateParams.token).then(function (response) {
          AuthService.authorize(response.data);
          return response.data;
        }).then(null, function () {
          return null;
        });
      }]
    }
  });


  $urlRouterProvider.otherwise('/tables');
});
