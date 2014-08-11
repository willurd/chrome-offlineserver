angular.module('app')
  .directive('networkInterfaceSelector', function($compile, $templateCache) {
    var localHostInterface = {
      address: '127.0.0.1',
      name: 'localhost'
    };

    var templateUrl = '/js/directives/network-interface-selector.html';

    return {
      restrict: 'E',
      replace: true,
      templateUrl: templateUrl,
      scope: null,
      controller: function($scope) {
        $scope.interfaces = [
          localHostInterface
        ];

        // TODO: Abstract this out to a service.
        chrome.system.network.getNetworkInterfaces(function(interfaces) {
          $scope.$apply(function() {
            $scope.interfaces = $scope.interfaces.concat(interfaces);
          });
        });
      }
    };
  });
