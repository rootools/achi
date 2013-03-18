var http = require('http');
var util = require('util');
var url = require('url');
var request = require('request');

http.createServer(function (req, res) {
  var query = url.parse(req.url, true).query;
//  var query = {};
//  query.token = '3CJ24XENQPZUZO1N5QI11KMANJ45J0PKWG2IWZFF2WVMGN4S';
  var response = [];
  /*request.get('https://api.foursquare.com/v2/users/self?oauth_token='+query.token, function(e, r, body){
    var obj = JSON.parse(body).response.user;
    response.checkins = obj.checkins.count;
    response.badges = obj.badges.count;
    response.friends = obj.friends.count;
    response.tips = obj.tips.count;
    response.mayorships = obj.mayorships.count;
    response.following = obj.following.count;
    response.lists = obj.lists.count;
    response.photos = obj.photos.count;
    response.scores = obj.scores.max;*/
    request.get('https://api.foursquare.com/v2/users/self/badges?oauth_token='+query.token, function(e, r, body){
      var badges = JSON.parse(body).response.badges;
      var badges_list = JSON.parse(body).response.sets.groups[0].items;
      for(var i in badges_list) {
        var elem = badges[badges_list[i]];
        response.push({badgeId: elem.badgeId, name: elem.name});
      }
      res.end(JSON.stringify(response));
    });
  //});  
  
}).listen(process.env.VCAP_APP_PORT || 8025);
