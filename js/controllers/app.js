angular.module('app')
  .controller('AppController', function($scope) {
    $scope.servers = [
      {
        interface: {
          address: '127.0.0.1',
          name: 'localhost'
        },
        port: 8001,
        status: 'off'
      },
      {
        interface: {
          address: '2601:9:8280:1d0:1e3e:84ff:fe0e:5d1',
          name: 'wlan0'
        },
        port: 8002,
        status: 'running'
      },
      {
        interface: {
          address: '10.0.0.16',
          name: 'wlan0'
        },
        port: 8003,
        status: 'sending'
      }
    ];
  });
