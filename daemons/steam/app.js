var http = require('http');
var url = require('url');
var request = require('request');

var steamAppID = 'B977C593721D51DF5CD96704FCD8DAD7';


http.createServer(function (req, res) {
  var query = url.parse(req.url, true).query;
  var response = {};
  response.maxTime = 0;
  
  request.get('http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key='+steamAppID+'&steamid='+query.steamid+'&format=json', function(e, r, b) {
    try {
      var games = JSON.parse(b).response;
      var games_array = games.games;
    
      for(var i in games_array) {
        if(games_array[i].playtime_forever > response.maxTime) {
          response.maxTime = games_array[i].playtime_forever;
        }
      }
      response.maxTime = Math.floor(response.maxTime / 60);
      response.games = games.game_count;
      request.get('http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key='+steamAppID+'&steamid='+query.steamid+'&relationship=friend', function(e, r, b) {
        if(JSON.parse(b).friendslist) {
          response.friends = JSON.parse(b).friendslist.friends.length;
        } else {
          response.friends = 0;
        }
        res.end(JSON.stringify(response));
      });
    } catch(e) {
      response.notavailable = true;
      res.end(JSON.stringify(response));
    }
  });

}).listen(process.env.VCAP_APP_PORT || 8095);