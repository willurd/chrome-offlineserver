define(function(require) {

  var HttpServer = require('http/server');

  // TODO: This file should ultimately be reading server configurations from
  // local storage and creating/configuring servers with that information,
  // rather than creating them manually here.

  var srv = new HttpServer('127.0.0.1', 8080);

  srv.get('', function(req, res) {
    res.json({
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
    });
  });

  var extra = '';

  _.times(5, function(i) {
    srv.get('test' + i + extra, function(req, res) {
      var obj = {};
      obj['key' + i] = 'value' + i;
      res.json(obj);
    });

    extra += '/:param' + i;
  });

  srv.start();

});
