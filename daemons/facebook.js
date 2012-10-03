var http = require('http');
var https = require('https');
var util = require('util');
var url = require('url');

var async = require('async');

http.createServer(function (req, res) {
  var query = url.parse(req.url, true).query;

  var response = {};
  var fql = {};
  fql.friends_count = 'SELECT+friend_count+FROM+user+WHERE+uid=me()';
//  fql.wall_count = 'SELECT+wall_count+FROM+user+WHERE+uid=me()';
//  fql.photo_count = 'SELECT+photo_count+FROM+album+WHERE+uid=me()';
  fql = JSON.stringify(fql);

  getData(fql, query.access_token, function(data) {
    data = data.data;
    for(var i=0;i<data.length;i++) {
      var tempObject = data[i].fql_result_set[0];
      for(var key in tempObject) {
        response[key] = tempObject[key];
      }
    }
    res.end(JSON.stringify(response));
  });

}).listen(1357, '127.0.0.1');

function getData(query, access_token, cb) {
  var options = {
      host: 'graph.facebook.com',
      method: 'GET'
  }

  options.path = '/fql?q='+query+'&access_token='+access_token;
  
  var callback = function(response) {
    var str = '';
    response.on('data', function(chunk) {
      str += chunk;
    });

    response.on('end', function() {
      str = JSON.parse(str);
      console.log(str);
      cb(str);
    });
  }

  https.request(options, callback).end();
}
