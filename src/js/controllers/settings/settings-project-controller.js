"use strict";

angular.module('app').controller('SettingsProjectController', function ($scope, project, user, User) {
  $scope.project = project;
  $scope.user = user;

  $scope.resendMail = function () {
    User.resendActivateMail().then(function () {

    });
  }
});
