var app = angular.module('app');

app.directive('serverItem', function() {
  return {
    restrict: 'E',
    templateUrl: '/js/directives/server-item.html',
    scope: {
      server: "="
    }
  };
});
