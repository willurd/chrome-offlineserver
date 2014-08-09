define(function(require) {

  var arraybuffer = require('util/arraybuffer');

  var tcp = chrome.sockets.tcp;
  var tcpServer = chrome.sockets.tcpServer;

  function log() {
    console.log.apply(console, arguments);
  }

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

  // http://www.w3.org/Protocols/rfc2616/rfc2616-sec6.html
  // http://www.jmarshall.com/easy/http/
  // 404 Not Found
  // 500 Server Error

  function onReceive(info) {
    log('Received info:', info);

    var requestData = arraybuffer.ab2str(info.data);

    var responseBody = '{"os": "Chrome OS"}';
    var responseData =
      'HTTP/1.1 200 Ok\n' +
      'Date: ' + new Date() + '\n' +
      'Content-Type: application/json\n' +
      'Content-Length: ' + responseBody.length + '\n\n' +
      responseBody;

    log('Received data:', requestData);
    log('Sending data:', responseData);

    tcp.send(info.socketId, arraybuffer.str2ab(responseData), catchAll(function(resultCode) {
      log("Data sent to new tcp client connection. Closing.");
      tcpServer.close(info.socketId);
    }.bind(this)));
  }

  function onAccept(info) {
    log('Accepted new connection:', info);

    if (info.socketId != this.socketId) {
      return log("onAccept: New socket id is different from server socket id");
    }

    tcp.onReceive.addListener(catchAll(onReceive.bind(this)));
    tcp.onReceiveError.addListener(function(info) {
      log('Receive error:', info);
    }.bind(this));

    tcp.setPaused(info.clientSocketId, false);
  }

  function onListen(socketId, resultCode) {
    if (resultCode < 0) {
      return log("Error listening:", chrome.runtime.lastError.message);
    }

    this.socketId = socketId;
    tcpServer.onAccept.addListener(catchAll(onAccept.bind(this)));
  }

  function listenAndAccept(socketId) {
    tcpServer.listen(socketId, this.host, this.port, this.maxConnections, catchAll(function(resultCode) {
      log('Listening on ' + this.host + ':' + this.port + ' (result: ' + resultCode + ')');
      onListen.call(this, socketId, resultCode);
    }.bind(this)));
  }

  function HttpServer(host, port, maxConnections) {
    this.host = host || '127.0.0.1';
    this.port = port || 8080;
    this.maxConnections = maxConnections || 0;
  }

  HttpServer.prototype = {
    start: function() {
      tcpServer.create({}, catchAll(function(info) {
        log('Socket created with info', info);
        listenAndAccept.call(this, info.socketId);
      }.bind(this)));
    }
  };

  return HttpServer;

});
