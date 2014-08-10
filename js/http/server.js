define(function(require) {

  var _ = require('underscore');
  var arraybuffer = require('util/arraybuffer');
  var HttpRequest = require('http/request');
  var HttpResponse = require('http/response');

  var tcp = chrome.sockets.tcp;
  var tcpServer = chrome.sockets.tcpServer;

  function catchAll(fn) {
    return function() {
      try {
        return fn.apply(null, arguments);
      } catch (e) {
        console.error(e);
        throw e;
      }
    };
  }

  function getRoute(req) {
    var routes = this.routes[req.method];

    for (var i = 0, len = routes.length; i < len; i++) {
      var route = routes[i];
      var match = route.matcher(req.path);

      if (match) {
        return [route, match];
      }
    }
  }

  function onReceive(info) {
    // console.log('Received info:', info);

    var req = new HttpRequest(arraybuffer.ab2str(info.data));
    var res = new HttpResponse(info.socketId, req);
    var matched = getRoute.call(this, req);

    if (!matched) {
      return res
        .setHead(404)
        .write();
    }

    var route = matched[0];
    var match = matched[1];
    route.callback(req, res);
  }

  function onAccept(info) {
    // console.log('Accepted new connection:', info);

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
      console.log('Listening on ' + this.host + ':' + this.port);
      onListen.call(this, socketId, resultCode);
    }.bind(this)));
  }

  function routeMethod(httpMethod) {
    return
  }

  var supportedHttpMethods = ['GET', 'POST', 'PUT', 'DELETE'];

  function HttpServer(host, port, maxConnections) {
    this.host = host || '127.0.0.1';
    this.port = port || 8080;
    this.maxConnections = maxConnections || 0;
    this.routes = _.object(supportedHttpMethods, supportedHttpMethods.map(function(method) {
      return [];
    }));
  }

  HttpServer.prototype = {
    start: function() {
      tcpServer.create({}, catchAll(function(info) {
        listenAndAccept.call(this, info.socketId);
      }.bind(this)));
    }
  };

  supportedHttpMethods.forEach(function(method) {
    HttpServer.prototype[method.toLowerCase()] = function(route, callback) {
      var regex = new RegExp('^' + route.replace(/:[^\/]+/g, '([^\/]+)') + '$');

      this.routes[method].push({
        route: route,
        matcher: function(path) {
          return path.match(regex);
        },
        callback: callback
      });
    };
  });

  return HttpServer;

});
