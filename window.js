window.onload = function() {
  document.querySelector('#greeting').innerText =
    'Hello, World! It is ' + new Date();

  var tcp = chrome.sockets.tcp;
  var tcpServer = chrome.sockets.tcpServer;

  var IP = '127.0.0.1';
  var PORT = 8080;
  var serverSocketId;

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

    // if (info.socketId != serverSocketId) {
    //   return console.error("onReceive: New socket id is different from server socket id");
    // }

    var requestData = ab2str(info.data);
    var responseData = 'hello chrome';

    console.log('Data:', requestData);

    tcp.send(info.socketId, str2ab(responseData), catchAll(function(resultCode) {
      console.log("Data sent to new tcp client connection. Closing.");
      tcpServer.close(info.socketId);
    }));
  }

  function onAccept(info) {
    console.log('Accepted new connection:', info);

    if (info.socketId != serverSocketId) {
      return console.error("onAccept: New socket id is different from server socket id");
    }

    tcp.setPaused(info.clientSocketId, false);
    tcp.onReceive.addListener(catchAll(onReceive));
    tcp.onReceiveError.addListener(function(info) {
      console.error('Receive error:', info);
    });

    // tcp.read(info.socketId, catchAll(function(info) {
    //   console.log('read stuff:', info);
    // }));
  }

  function onListen(socketId, resultCode) {
    if (resultCode < 0) {
      return console.error("Error listening:", chrome.runtime.lastError.message);
    }

    serverSocketId = socketId;
    tcpServer.onAccept.addListener(catchAll(onAccept));
  }

  function listenAndAccept(socketId) {
    tcpServer.listen(socketId, IP, PORT, 20, catchAll(function(resultCode) {
      console.log('Listening on ' + IP + ':' + PORT + ' (result: ' + resultCode + ')');
      onListen(socketId, resultCode);
    }));
  }

  tcpServer.create({}, catchAll(function(info) {
    console.log('Socket created with info', info);
    listenAndAccept(info.socketId);
  }));
};

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

function str2ab(str) {
  var buf = new ArrayBuffer(str.length); // 2 bytes for each char
  var bufView = new Uint8Array(buf);
  for (var i=0, strLen=str.length; i<strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}
