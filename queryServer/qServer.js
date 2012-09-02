var http = require('http');
var querystring = require('querystring');
var hd = require('hero-data');

var cTwitter = require('./qS_twitter.js');

var redis = require("redis"),
    client = redis.createClient();
    client.select(6);

var db;

function mongoConnect() {
  var mongodb = require("mongodb"),
    mongoserver = new mongodb.Server('127.0.0.1', 27017, {auto_reconnect: true}),
    db_connector = new mongodb.Db('achi', mongoserver, '');

  db_connector.open(function(err, dbs) {
    db = dbs;
  });
}

mongoConnect();

function getData(service, auth, cb) {
  if(service == 'twitter') {
    var options = {
        host: '127.0.0.1',
        port: 1337,
        path: '/?user='+auth};
  }

  callback = function(res) {
    var str = '';
    res.on('data', function(chunk) {
      str += chunk;
    });

    res.on('end', function() {
      cb(JSON.parse(str));
    });
  }

  http.request(options, callback).end();

}

getData('twitter', 'rootools', function(data) {
  var uid = 'iyh1xfsMNwYp3DigmBuX';
  cTwitter.checkTwitterAchievements(uid, data, db, function(res) {
//    console.log(res);
  });
});
