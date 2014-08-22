var app = angular.module('app');

app.directive('serverStatusLed', function() {
  var COLORS = {
    off: 'blank',
    running: 'green',
    receiving: 'yellow',
    sending: 'orange'
  };

  var DEFAULT_COLOR = 'blue';

  return {
    restrict: 'E',
    templateUrl: '/js/directives/server-status-led.html',
    scope: {
      status: '='
    },
    controller: function($scope) {
      $scope.color = function() {
        return COLORS[$scope.status] || DEFAULT_COLOR;
      };
    }
  };
});
