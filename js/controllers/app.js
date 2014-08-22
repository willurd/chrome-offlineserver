angular.module('app')
  .controller('AppController', function($scope) {
    $scope.$watch('networkInterface', function() {
      var i = $scope.networkInterface || {};
      console.log('Interface changed:', i.name, i.address);
    });
  });
