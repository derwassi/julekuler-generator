'use strict';


// Declare app level module which depends on filters, and services
angular.module('kpg', [
  'ngRoute',
  'kpg.filters',
  'kpg.services',
  'kpg.directives',
  'kpg.controllers'
]);
/*config(['$routeProvider', function($routeProvider) {
  $routeProvider.always({templateUrl: 'partials/content'})
  $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
  $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);*/
