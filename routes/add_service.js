var https = require('https');
var querystring = require('querystring');

var oauth = require('oauth').OAuth;

var twitterOA = new oauth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  'CXWNIxTwg8vyTmtETDbPMA',
  'd4rgsi9dvbMhUgYVT3kbQD0L9lZ8I8NO8dG2oqOHY',
  '1.0',
  'http://rootools.ru/add_service/twitter',
  'HMAC-SHA1'
);

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

exports.vk = function(req, res) {
  if(!req.query.code) {
    res.redirect('http://oauth.vk.com/authorize?client_id=3126840&scope=notify,friends,photos,audio,video,status,wall,groups,notifications,offline&display=popup&response_type=code&tt=12&redirect_uri=http://rootools.ru/add_service/vk');
  } 
  if(req.query.code) {
    var options = {
      host: 'oauth.vk.com',
      method: 'GET',
      path: '/access_token?client_id=3126840&client_secret=nlKuMIbXcEV6HqLn1W1n&code='+req.query.code+'&redirect_uri=http://rootools.ru/add_service/vk&'
    };

    var callback = function(response) {
      var str = '';

      response.on('data', function(chunk) {
        str += chunk;
      });

      response.on('end', function() {
        var data = JSON.parse(str);
        add_service(req.session, data, 'vkontakte');
      });
    }

    https.request(options, callback).end();
    res.redirect('http://rootools.ru');
  }
}

exports.twitter = function(req, res) {
  console.log(req.query);
  if(req.query.oauth_token) {
    twitterOA.getOAuthAccessToken(req.query.oauth_token, req.session.request_twitter_oauth_token_secret, req.query.oauth_verifier, function(err, oauth_token, oauth_token_secret, results) {
      console.log(err, oauth_token, oauth_token_secret, results);
      var data = {oauth_token: oauth_token, oauth_token_secret: oauth_token_secret, user_id: results.user_id, screen_name: results.screen_name };
      add_service(req.session, data, 'twitter');
      res.redirect('http://rootools.ru/');
    });
  } else {

    twitterOA.getOAuthRequestToken(function(error, request_oauth_token, request_oauth_token_secret, results){
      req.session.twitter_request_oauth_token_secret = request_oauth_token_secret;
      res.redirect('https://api.twitter.com/oauth/authorize?oauth_token='+request_oauth_token);
    });
  }
}

function add_service(session, data, service) {
  if(service == 'vkontakte') {
    var account = { access_token: data.access_token, user_id: data.user_id};
  }
  if(service = 'twitter') {
    var account = data;
  }
  testService(session.uid, service, function(check) {
    db.collection('services_connections', function(err,collection) {
      if(check == true) {
        collection.insert({uid: session.uid, service:service, service_login: account, addtime:new Date().getTime(), valid: true, lastupdate: new Date().getTime() - 1800000}, function(err, doc) {});
      } else {
        collection.update({uid: session.uid, service:service},{$set: {service_login: account, valid: true}}, function(err,doc) {});
      }
      });
  });
}

function testService(uid, service, cb) {
  db.collection('services_connections', function(err,collection) {
    collection.findOne({uid: uid, service:service}, function(err, doc) {
      if(err == null && doc == null) {
        cb(true);
      } else {
        cb(false);
      }
    });
  });
}

