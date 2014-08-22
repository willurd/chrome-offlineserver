angular.module('app')
  .controller('AppController', function($scope) {
    $scope.servers = [
      { address: '127.0.0.1', port: 8001 },
      { address: '2601:9:8280:1d0:1e3e:84ff:fe0e:5d1', port: 8002 },
      { address: '10.0.0.16', port: 8003 },
    ];
  });
