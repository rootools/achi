var http = require('http');
var util = require('util');
var url = require('url');
var request = require('request');

http.createServer(function (req, res) {
  var query = url.parse(req.url, true).query;
  var response = {};
  request.get('https://api.foursquare.com/v2/users/self?oauth_token='+query.token, function(e, r, body){
    var obj = JSON.parse(body).response.user;
    response.checkins = obj.checkins.count;
    response.badges = obj.badges.count;
    response.friends = obj.friends.count;
    response.tips = obj.tips.count;
    response.mayorships = obj.mayorships.count;
    response.following = obj.following.count;
    response.lists = obj.lists.count;
    response.photos = obj.photos.count;
    response.scores = obj.scores.max;
    res.end(JSON.stringify(response));
  });  
  
}).listen(process.env.VCAP_APP_PORT || 8025);
