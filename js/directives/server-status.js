var app = angular.module('app');

app.directive('serverStatus', function() {
  return {
    restrict: 'E',
    templateUrl: '/js/directives/server-status.html',
    scope: {
      status: '='
    }
  };
});
