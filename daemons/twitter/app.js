var http = require('http');
var util = require('util');
var url = require('url');
var oauth = require('oauth').OAuth;

var twitterOA = new oauth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  'CXWNIxTwg8vyTmtETDbPMA',
  'd4rgsi9dvbMhUgYVT3kbQD0L9lZ8I8NO8dG2oqOHY',
  '1.0',
  'http://achivster.com/add_service/twitter',
  'HMAC-SHA1'
);

http.createServer(function (req, res) {
  var query = url.parse(req.url, true).query;


  twitterOA.get('https://api.twitter.com/1.1/account/verify_credentials.json', query.oauth_token, query.oauth_token_secret, function(err, data) {
    data = JSON.parse(data);

    var profile = {};
    profile.statuses_count = data.statuses_count;
    profile.followers_count = data.followers_count;
    profile.friends_count = data.friends_count;
    profile.created_at = data.created_at;
    profile.url = data.url;
    profile.favourites_count = data.favourites_count;
    twitterOA.get('https://api.twitter.com/1.1/friendships/lookup.json?screen_name=achivster_ru,achivster', query.oauth_token, query.oauth_token_secret, function(err, is_achivster) {
      is_achivster = JSON.parse(is_achivster);
      profile.is_achivster = false;
      for(var i in is_achivster) {
        if(is_achivster[i].connections[0] === 'following') {
          profile.is_achivster = true;
        }
      }
      res.end(JSON.stringify(profile));
    });
  
  });

}).listen(process.env.VCAP_APP_PORT || 8065);
