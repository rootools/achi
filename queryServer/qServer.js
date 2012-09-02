var http = require('http');
var querystring = require('querystring');
var hd = require('hero-data');
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

function checkData() {
  var post_data = {nickname:'rootools'};
  post_data = querystring.stringify(post_data);
  var post_options = { host: '127.0.0.1',
                       port: 1337,
                       path: '/',
                       method: 'POST',
                       headers: { 'Content-Type': 'application/x-www-form-urlencoded',  
                                'Content-Length': post_data.length}
                     };

  var post_req = http.request(post_options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log(JSON.parse(chunk));
    });
  });

  post_req.write(post_data);
  post_req.end();
}

checkData();
