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
  fql.photo_count = 'SELECT+photo_count+FROM+album+WHERE+owner=me()';
  fql.likes_count = 'SELECT+likes_count+FROM+user+WHERE+uid=me()';
  fql.is_achivster = 'SELECT+page_id+FROM+page_fan+WHERE+uid=me()';
  fql = JSON.stringify(fql);

  getData(fql, query.access_token, function(data) {
    if(data.error) {
      res.end(JSON.stringify(data));
    } else {
    
    data = data.data;
    response.is_achivster = false;
    for(var i=0;i<data.length;i++) {

      if(data[i].name === 'is_achivster') {
        for(var n in data[i].fql_result_set) {
          if(data[i].fql_result_set[n].page_id === 483770871661354) {
            response.is_achivster = true;
          }
        }
      } else {

        var tempObject = data[i].fql_result_set[0];
        for(var key in tempObject) {
          response[key] = tempObject[key];
        }
      }
    }
    res.end(JSON.stringify(response));
  }
  });

}).listen(process.env.VCAP_APP_PORT || 8075);

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
      cb(str);
    });
  }

  https.request(options, callback).end();
}
