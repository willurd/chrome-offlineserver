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
      link: function(scope, elem, attrs) {
        scope.interfaces = [];
        // scope.interfaces = [
        //   localHostInterface
        // ];

        chrome.system.network.getNetworkInterfaces(function(interfaces) {
          scope.interfaces = scope.interfaces.concat(interfaces);

          var el = $compile($templateCache.get(templateUrl)[1])(scope);
          elem.html('');
          elem.append(el[0]);
          console.log(scope, el[0].innerHTML);
        });
      }
    };
  });
