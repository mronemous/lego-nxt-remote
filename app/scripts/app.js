'use strict';

angular.module('legoNxtRemoteApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
         redirectTo: '/remote' //No main page yet.
      })
      .when('/remote', {
        templateUrl: 'views/remote.html',
        controller: 'RemoteCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
