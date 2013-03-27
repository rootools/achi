var http = require('http');
var util = require('util');
var url = require('url');
var request = require('request');

http.createServer(function (req, res) {
  var query = url.parse(req.url, true).query;
  var response = [];
  request.get('https://api.foursquare.com/v2/users/self/badges?oauth_token='+query.token, function(e, r, body){
    if(e) {
      res.end(JSON.stringify({error: 1}));
    } else {
      var badges = JSON.parse(body).response.badges;
      var badges_list = JSON.parse(body).response.sets.groups[0].items;
      for(var i in badges_list) {
        var elem = badges[badges_list[i]];
        response.push({badgeId: elem.badgeId, name: elem.name});
      }
      res.end(JSON.stringify(response));
    }
  });
  
}).listen(process.env.VCAP_APP_PORT || 8025);
