var app = angular.module('app');

app.directive('networkInterfaceSelector', function() {
  var localHostInterface = {
    address: '127.0.0.1',
    name: 'localhost'
  };

  return {
    restrict: 'E',
    replace: true,
    templateUrl: '/js/directives/network-interface-selector.html',
    scope: {
      value: "="
    },
    controller: function($scope) {
      $scope.value = $scope.value || localHostInterface;
      $scope.interfaces = [
        localHostInterface
      ];

      function getInterfaceWithAddress(address) {
        for (var i = 0, len = $scope.interfaces.length; i < len; i++) {
          if ($scope.interfaces[i].address === address) {
            return $scope.interfaces[i];
          }
        }

        return null;
      }

      // TODO: Abstract this out to a service.
      chrome.system.network.getNetworkInterfaces(function(interfaces) {
        $scope.$apply(function() {
          $scope.interfaces = $scope.interfaces.concat(interfaces);

          if (typeof $scope.value === 'string') {
            $scope.value = getInterfaceWithAddress($scope.value) || localHostInterface;
          } else if ($scope.value && typeof $scope.value === 'object') {
            $scope.value = getInterfaceWithAddress($scope.value.address);
          }
        });
      });
    }
  };
});
