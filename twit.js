var util = require('util');
var twitter = require('twitter');

var twit = new twitter({
	consumer_key: 'CXWNIxTwg8vyTmtETDbPMA',
        consumer_secret: 'd4rgsi9dvbMhUgYVT3kbQD0L9lZ8I8NO8dG2oqOHY',
        access_token_key: '39984798-Lgxe5ff90d0DJDGr1sLctWnu4zsLMu8iwMjXFzcKo',
        access_token_secret: 'SDsrDcwkxS3ihuD0yJLq1QWOVSPxv7kwipc3xIJg'
});

var profile = {};

twit.get('/users/show.json', {include_entities:true, screen_name:'rootools'}, function(data) {
  profile.statuses_count = data.statuses_count;
  profile.followers_count = data.followers_count;
  profile.friends_count = data.friends_count;
  profile.created_at = data.created_at;
  profile.url = data.url;
  profile.favourites_count = data.favourites_count;
  console.log(data);
  console.log(profile);
});

