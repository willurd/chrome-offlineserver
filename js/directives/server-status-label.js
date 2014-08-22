var app = angular.module('app');

app.directive('serverStatusLabel', function() {
  return {
    restrict: 'E',
    templateUrl: '/js/directives/server-status-label.html',
    scope: {
      status: '='
    }
  };
});
