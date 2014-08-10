define(function(require) {

  var _ = require('underscore');
  var arraybuffer = require('util/arraybuffer');

  var tcp = chrome.sockets.tcp;
  var tcpServer = chrome.sockets.tcpServer;

  var statusMessages = {
    200: 'Ok',
    404: 'Not Found',
    500: 'Server Error'
  };

  function send(content) {
    tcp.send(this.socketId, arraybuffer.str2ab(content), catchAll(function(resultCode) {
      console.log("Data sent to new tcp client connection. Closing.");
      tcpServer.close(this.socketId);
    }.bind(this)));

    this.sent = true;

    return this;
  }

  function sendLine(content) {
    send.call(this, (content || '') + '\n');
  }

  function makeHeadersString() {
    var lines = _.map(this.headers, function(value, name) {
      return name + ': ' + value;
    });

    return lines.join('\n');
  }

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

  // http://nodejs.org/api/http.html#http_class_http_serverresponse

  function HttpResponse(socketId) {
    this.socketId = socketId;
    this.sent = false;
    this.statusCode = 200;
    this.headers = {};
  }

  HttpResponse.prototype = {
    setHead: function(statusCode, headers) {
      this.statusCode = statusCode;
      return this.setHeaders(headers);
    },

    setHeader: function(name, value) {
      this.headers[name] = value;
      return this;
    },

    setHeaders: function(headers) {
      _.extend(this.headers, headers);
      return this;
    },

    write: function(body, contentType) {
      if (this.sent) {
        return console.log('Error: HttpResponse does not support chunked writing');
      }

      if (contentType) {
        this.setHeader('Content-Type', contentType);
      }

      body = String(body || '');
      this.setHeader('Content-Length', body.length);

      return send.call(this,
        'HTTP/1.1 ' + this.statusCode + ' ' + statusMessages[this.statusCode] + '\n' +
        makeHeadersString.call(this) + '\n\n' +
        body
      );
    },

    json: function(value) {
      return this.write(JSON.stringify(value), 'application/json');
    },

    html: function(value) {
      return this.write(value, 'text/html');
    },

    text: function(value) {
      return this.write(value, 'text/plain');
    },

    xml: function(value) {
      return this.write(value, 'text/xml');
    }
  };

  return HttpResponse;

});
