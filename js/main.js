define(function(require) {

  var HttpServer = require('http/server');

  // TODO: This file should ultimately be reading server configurations from
  // local storage and creating/configuring servers with that information,
  // rather than creating them manually here.

  var serverConfigs = [
    {
      name: '',
      host: '127.0.0.1',
      port: 8080,
      routes: [
        {
          method: 'GET',
          route: '',
          dataType: 'json',
          data: {
            "links": {
              "posts.author": {
                "href": "http://example.com/people/{posts.author}",
                "type": "people"
              },
              "posts.comments": {
                "href": "http://example.com/comments/{posts.comments}",
                "type": "comments"
              }
            },
            "posts": [{
              "id": "1",
              "title": "Rails is Omakase",
              "links": {
                "author": "9",
                "comments": [ "5", "12", "17", "20" ]
              }
            }]
          }
        },
        {
          method: 'GET',
          route: 'test1/:param1',
          dataType: 'json',
          data: {
            'key1': 'value1'
          }
        },
        {
          method: 'GET',
          route: 'test2/:param1/:param2',
          dataType: 'json',
          data: {
            'key2': 'value2'
          }
        },
        {
          method: 'GET',
          route: 'test3/:param1/:param2/:param3',
          dataType: 'json',
          data: {
            'key3': 'value3'
          }
        }
      ]
    }
  ];

  var servers = {};

  serverConfigs.forEach(function(config) {
    var host = config.host || '127.0.0.1';
    var port = config.port || 8080;
    var key = host + ':' + port;
    var srv = new HttpServer(host, port);

    config.routes.forEach(function(route) {
      var method = route.method.toLowerCase();
      srv[method](route.route, function(req, res) {
        res[route.dataType](route.data);
      });
    });

    servers[key] = srv;
  });

  for (var key in servers) {
    servers[key].start();
  }

});
