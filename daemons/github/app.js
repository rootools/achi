var http = require('http');
var https = require('https');
var util = require('util');
var url = require('url');

http.createServer(function (req, res) {
  var query = url.parse(req.url, true).query;

  var response = {};

  getData('/user', query.access_token, function(data) {
    res.end(JSON.stringify(response));
  });

}).listen(process.env.VCAP_APP_PORT || 8045);

function getData(query, access_token, cb) {
  var options = {
      host: 'api.github.com',
      method: 'GET'
  }

  options.path = query+'?access_token='+access_token;
  
  var callback = function(response) {
    var str = '';
    response.on('data', function(chunk) {
      str += chunk;
    });

    response.on('end', function() {
      str = JSON.parse(str);
      cb(str);
    });
  }

  https.request(options, callback).end();
}