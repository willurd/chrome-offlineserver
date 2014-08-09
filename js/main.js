define(function(require) {

  var HttpServer = require('http/server');

  var server = new HttpServer('127.0.0.1', 8080);

  server.start();

});
