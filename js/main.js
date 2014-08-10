define(function(require) {

  var HttpServer = require('http/server');

  var server = new HttpServer('127.0.0.1', 8080);

  server.route({
    '': function(req, res) {
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
    }
  });

  server.start();

});
