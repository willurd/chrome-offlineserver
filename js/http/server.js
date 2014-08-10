define(function(require) {

  var _ = require('underscore');
  var arraybuffer = require('util/arraybuffer');
  var HttpRequest = require('http/request');
  var HttpResponse = require('http/response');

  var tcp = chrome.sockets.tcp;
  var tcpServer = chrome.sockets.tcpServer;

  function catchAll(fn) {
    return function() {
      var result;

      try {
        result = fn.apply(null, arguments);
      } catch (e) {
        console.error(e);
        throw e;
      }

      return result;
    };
  }

  function onReceive(info) {
    console.log('Received info:', info);

    var req = new HttpRequest(arraybuffer.ab2str(info.data));
    var res = new HttpResponse(info.socketId);

    this.routes[''](req, res);
  }

  function onAccept(info) {
    console.log('Accepted new connection:', info);

    if (info.socketId != this.socketId) {
      return console.log("onAccept: New socket id is different from server socket id");
    }

    tcp.onReceive.addListener(catchAll(onReceive.bind(this)));
    tcp.onReceiveError.addListener(function(info) {
      console.log('Receive error:', info);
    }.bind(this));

    tcp.setPaused(info.clientSocketId, false);
  }

  function onListen(socketId, resultCode) {
    if (resultCode < 0) {
      return console.log("Error listening:", chrome.runtime.lastError.message);
    }

    this.socketId = socketId;
    tcpServer.onAccept.addListener(catchAll(onAccept.bind(this)));
  }

  function listenAndAccept(socketId) {
    tcpServer.listen(socketId, this.host, this.port, this.maxConnections, catchAll(function(resultCode) {
      console.log('Listening on ' + this.host + ':' + this.port + ' (result: ' + resultCode + ')');
      onListen.call(this, socketId, resultCode);
    }.bind(this)));
  }

  function HttpServer(host, port, maxConnections) {
    this.host = host || '127.0.0.1';
    this.port = port || 8080;
    this.maxConnections = maxConnections || 0;
    this.routes = {};
  }

  HttpServer.prototype = {
    start: function() {
      tcpServer.create({}, catchAll(function(info) {
        console.log('Socket created with info', info);
        listenAndAccept.call(this, info.socketId);
      }.bind(this)));
    },

    route: function(routes) {
      _.extend(this.routes, routes);
    }
  };

  return HttpServer;

});
