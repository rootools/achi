var http = require('http');
var util = require('util');
var url = require('url');
var request = require('request');

http.createServer(function (req, res) {
  var query = url.parse(req.url, true).query;
  var response = {};
  request.get('https://api.instagram.com/v1/users/'+query.id+'/?access_token='+query.token, function(e, r, body){
    if(e || JSON.parse(body).meta.error_type) {
      res.end(JSON.stringify({error: 1}));
    } else {
      body = JSON.parse(body).data.counts;
      response.media = body.media;
      response.followed_by = body.followed_by;
      response.follows = body.follows;
      console.log(response);
      res.end(JSON.stringify(response));
    }
  });  
  
}).listen(process.env.VCAP_APP_PORT || 8035);
