angular.module('app').service('UserService', function ($cacheFactory, $rootScope, $gandalf) {

  var cache = $cacheFactory('user');

  $rootScope.$on('userDidLogout', function () {
    cache.removeAll();
  });

  this.current = function () {
    return cache.get('user') || $gandalf.admin.getUser().then(function (resp) {
      cache.put('user', resp.data);
      return resp.data;
    });
  };

  this.verifyEmail = function (token) {
    return $gandalf.admin.verifyUserEmail(token);
  }
});
