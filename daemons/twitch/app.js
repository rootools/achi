var http = require('http');
var url = require('url');
var request = require('request');

http.createServer(function (req, res) {
  var query = url.parse(req.url, true).query;
  var response = {};
  
  var headers = {
    'Accept': 'application/vnd.twitchtv.v2+json',
    'Authorization': 'OAuth '+query.access_token
  };

  request.get({url: 'https://api.twitch.tv/kraken/user', headers: headers},function(e,r,b) {
    var name = JSON.parse(b).name;
    request.get({url: 'https://api.twitch.tv/kraken/channels/'+name+'/videos?limit=100', headers: headers},function(e,r,b) {
      response.videos_count = JSON.parse(b)._total;
      res.end(JSON.stringify(response));
    });
  });


}).listen(process.env.VCAP_APP_PORT || 8105);