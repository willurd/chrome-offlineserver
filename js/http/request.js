define(function(require) {

  var _ = require('underscore');

  function processData(data) {
    var split = data.split('\n\n');
    processHeadData.call(this, split[0]);
    this.body = split.slice(1).join('\n\n');
  }

  function processHeadData(data) {
    var split = data.split('\n').filter(function(line) {
      return !!line.trim();
    });
    processRequestLine.call(this, split[0]);
    processHeaders.call(this, split.slice(1));
  }

  function processRequestLine(line) {
    var split = line.split(' ');
    this.method = split[0];
    this.path = split[1].slice(1);
    this.version = split[2];
  }

  function processHeaders(lines) {
    this.headers = {};

    lines.forEach(function(line) {
      var split = line.split(': ');
      this.headers[split[0]] = split[1];
    }.bind(this));
  }

  // http://nodejs.org/api/http.html#http_class_http_clientrequest

  function HttpRequest(data) {
    processData.call(this, data);

    // console.log('--- request');
    // console.log('method:', this.method);
    // console.log('path:', this.path);
    // console.log('version:', this.version);
    // console.log('headers:', this.headers);
    // console.log('body:', this.body);
  }

  return HttpRequest;

});
