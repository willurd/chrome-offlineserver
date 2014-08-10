define(function(require) {

  // http://nodejs.org/api/http.html#http_class_http_clientrequest

  function HttpRequest() {

  }

  HttpRequest.prototype = {
    // @param {string=} encoding
    write: function(chunk, encoding) {
      // TODO: Write me.
    },

    // @param {string=} data
    // @param {string=} encoding
    end: function(data, encoding) {
      // TODO: Write me.
    },

    abort: function() {
      // TODO: Write me.
    }
  };

  return HttpRequest;

});
