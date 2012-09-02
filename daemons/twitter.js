var http = require('http');
var util = require('util');
var url = require('url');
var twitter = require('twitter');

var twit = new twitter({
	consumer_key: 'CXWNIxTwg8vyTmtETDbPMA',
  consumer_secret: 'd4rgsi9dvbMhUgYVT3kbQD0L9lZ8I8NO8dG2oqOHY',
  access_token_key: '39984798-Lgxe5ff90d0DJDGr1sLctWnu4zsLMu8iwMjXFzcKo',
  access_token_secret: 'SDsrDcwkxS3ihuD0yJLq1QWOVSPxv7kwipc3xIJg'
});

http.createServer(function (req, res) {
  var query = url.parse(req.url, true).query;
  twit.get('/users/show.json', {include_entities:true, screen_name:query.user}, function(data) {
    var profile = {};
    profile.statuses_count = data.statuses_count;
    profile.followers_count = data.followers_count;
    profile.friends_count = data.friends_count;
    profile.created_at = data.created_at;
    profile.url = data.url;
    profile.favourites_count = data.favourites_count;
    res.end(JSON.stringify(profile));
  });
}).listen(1337, '127.0.0.1');

