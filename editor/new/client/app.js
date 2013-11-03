var Editor = angular.module('editor', []);

var path = {};
path.api_prefix = '/api';

Editor.config(function ($routeProvider, $httpProvider) {
  $routeProvider
    .when('/stat', {templateUrl: 'page/stat.html', controller: 'StatController'})
    .when('/achivs', {templateUrl: 'page/achivs.html', controller: 'AchivsController'})
    .otherwise({redirectTo: '/'});
});

function StatController ($scope, $rootScope, $routeParams, $http, $timeout) {
  $http.post(path.api_prefix + '/get/stat').success(function(stat){
    $scope.stat = stat;
    console.log(stat);
  });
}

function AchivsController ($scope, $rootScope, $routeParams, $http, $timeout) {

}