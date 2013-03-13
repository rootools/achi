var config = require('../configs/config.js');
var https = require('https');
var querystring = require('querystring');
var sys = require('sys');
var request = require('request');
var uploads = require('./upload.js');

var ext_achivster = require('../external/achivster.js');

var oauth = require('oauth').OAuth;

var twitterOA = new oauth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  'CXWNIxTwg8vyTmtETDbPMA',
  'd4rgsi9dvbMhUgYVT3kbQD0L9lZ8I8NO8dG2oqOHY',
  '1.0',
  config.site.url+'add_service/twitter',
  'HMAC-SHA1'
);

var bitbucketOA = new oauth(
  'https://bitbucket.org/!api/1.0/oauth/request_token',
  'https://bitbucket.org/!api/1.0/oauth/access_token',
  'ENSfZreEzhHYjtWLmG',
  'kbgFjZNAcMADEmpF44c2wrARTrY3NKEY',
  '1.0',
  config.site.url+'add_service/bitbucket',
  'HMAC-SHA1'
);

var db;

function mongoConnect() {
  var mongodb = require("mongodb"),
    mongoserver = new mongodb.Server(config.mongo.host, config.mongo.port, config.mongo.server_config),
    db_connector = new mongodb.Db(config.mongo.db, mongoserver, config.mongo.connector_config);

  db_connector.open(function(err, dbs) {
    db = dbs;
  });
}

mongoConnect();

exports.vk = function(req, res) {
  if(!req.query.code) {
    res.redirect('http://oauth.vk.com/authorize?client_id=3126840&scope=notify,friends,photos,audio,video,status,wall,groups,notifications,offline&display=popup&response_type=code&tt=12&redirect_uri='+config.site.url+'add_service/vkontakte');
  } else {
    
    var options = {
      host: 'oauth.vk.com',
      method: 'GET',
      path: '/access_token?client_id=3126840&client_secret=nlKuMIbXcEV6HqLn1W1n&code='+req.query.code+'&redirect_uri='+config.site.url+'add_service/vkontakte&'
    };

    var callback = function(response) {
      var str = '';

      response.on('data', function(chunk) {
        str += chunk;
      });

      response.on('end', function() {
        var data = JSON.parse(str);
        delete data.expires_in;
        add_service(req.session, data, 'vkontakte', function() {
          res.redirect(config.site.url+'dashboard');
        });
      });
    };

    https.request(options, callback).end();
  }
};

exports.twitter = function(req, res) {
  if(req.query.oauth_token) {
    twitterOA.getOAuthAccessToken(req.query.oauth_token, req.session.request_twitter_oauth_token_secret, req.query.oauth_verifier, function(err, oauth_token, oauth_token_secret, results) {
      var data = {oauth_token: oauth_token, oauth_token_secret: oauth_token_secret, user_id: results.user_id, screen_name: results.screen_name };
      add_service(req.session, data, 'twitter', function(){
        delete req.session.twitter_request_oauth_token_secret;
        res.redirect(config.site.url+'dashboard');
      });
    });
  } else {
    twitterOA.getOAuthRequestToken(function(error, request_oauth_token, request_oauth_token_secret, results){
      req.session.twitter_request_oauth_token_secret = request_oauth_token_secret;
      res.redirect('https://api.twitter.com/oauth/authorize?oauth_token='+request_oauth_token);
    });
  }
};

exports.facebook = function(req, res) {
  if(!req.query.code) {  
    res.redirect('https://www.facebook.com/dialog/oauth?client_id=258024554279925&redirect_uri='+config.site.url+'add_service/facebook&state=123&scope=publish_actions,user_photos,user_likes,read_stream');
  } else {
    var code = req.query.code;

    var options = {
      host: 'graph.facebook.com',
      method: 'GET',
      path: '/oauth/access_token?client_id=258024554279925&redirect_uri='+config.site.url+'add_service/facebook&client_secret=7ae18b84811c2b811dd11d31050f2e4e&code='+code
    };

    var callback = function(response) {
      var str = '';

      response.on('data', function(chunk) {
        str += chunk;
      });

      response.on('end', function() {
        var data = querystring.parse(str).access_token;
        add_service(req.session, data, 'facebook', function(){
          res.redirect(config.site.url+'dashboard');
        });
      });
    };

    https.request(options, callback).end();
  }
};

exports.bitbucket = function(req, res) {
  if(req.query.oauth_token) {
    bitbucketOA.getOAuthAccessToken(req.session.request_oauth_token, req.session.request_oauth_token_secret, req.query.oauth_verifier, function(error, oauthAccessToken, oauthAccessTokenSecret, results){
      var data = {token: oauthAccessToken, secret: oauthAccessTokenSecret};
      add_service(req.session, data, 'bitbucket', function(){
        delete req.session.request_oauth_token;
        delete req.session.request_oauth_token_secret;
        res.redirect(config.site.url+'dashboard');
      });
    });
  } else {
    bitbucketOA.getOAuthRequestToken(function(error, request_oauth_token, request_oauth_token_secret, results){
      req.session.request_oauth_token = request_oauth_token;
      req.session.request_oauth_token_secret = request_oauth_token_secret;
      res.redirect('https://bitbucket.org/!api/1.0/oauth/authenticate?oauth_token='+request_oauth_token);
    });
  }
};

exports.github = function(req, res) {
  if(!req.query.code) {
    res.redirect('https://github.com/login/oauth/authorize?client_id=1167c7508199dd90ba7c&scope=user,repo:status,gist');
  } else {
    var options = {
      host: 'github.com',
      method: 'POST',
      path: '/login/oauth/access_token?client_id=1167c7508199dd90ba7c&client_secret=4521cb71a4dd118099810a98028c302b66ad3fa8&code='+req.query.code
    };

    var callback = function(response) {
      var str = '';

      response.on('data', function(chunk) {
        str += chunk;
      });

      response.on('end', function() {
        var data = querystring.parse(str);
        add_service(req.session, data, 'github', function(){
          res.redirect(config.site.url+'dashboard');
        });
      });
    };

    https.request(options, callback).end();
  }
};

exports.instagram = function(req, res) {
  if(!req.query.code) {
    res.redirect('https://api.instagram.com/oauth/authorize/?client_id=952cd8726937430f86a277c7133b0df4&redirect_uri=http://achivster.com/add_service/instagram&response_type=code');
  } else {
    var code = req.query.code;
  
    request.post('https://api.instagram.com/oauth/access_token', {form:{client_id: '952cd8726937430f86a277c7133b0df4', client_secret: '8f7fcd3306854371bc7b1486706cfb37', grant_type: 'authorization_code', redirect_uri: 'http://achivster.com/add_service/instagram',code:code}}, function(e, r, body){
      var token = JSON.parse(body).access_token;
      var id = JSON.parse(body).user.id;
      add_service(req.session, {access_token: token, id: id}, 'instagram', function(){
        res.redirect(config.site.url+'dashboard');
      });
    });
  } 
};

function add_service(session, account, service, cb) {
  testService(session.uid, service, function(check, is_first) {
    if(is_first) {
      get_user_name_by_service(session.uid, service, account, function() {
        write_newuser_to_db(function(){
          cb();
        });
      });
    } else {
      write_newuser_to_db(function(){
        cb();
      });
    }
    
    function write_newuser_to_db(cbk) {
      db.collection('services_connections', function(err,collection) {
        db.collection('users_achievements', function(err, ua_collection) {
          if(check) {
            collection.insert({uid: session.uid, service:service, service_login: account, addtime:new Date().getTime(), valid: true, lastupdate: new Date().getTime() - 3600000, type: 'internal'}, function(err, doc) {
              ua_collection.insert({uid:session.uid, service:service, achievements: [], type: 'internal'}, function(err, doc) {
                cbk();
              });
            });
          } else {
            collection.update({uid: session.uid, service:service},{$set: {service_login: account, valid: true}}, function(err,doc) {
              cbk();
            });
          }
        });
      });
    }
    
  });
}

function testService(uid, service, cb) {
  
  db.collection('services_connections', function(sc_err,sc_collection) {
  db.collection('users_achievements', function(ua_err, ua_collection) {
    sc_collection.find({uid: uid}).toArray(function(sc_err, sc_doc) {
    var is_first = false;
    var check = true;
    if(sc_doc.length === 2) {
      is_first = true;
    }
    
    // Earned achiv for first service
    if(sc_doc.length === 2) {
      ext_achivster.main(uid, 'eSkuacz7tW1yUayFp1Xes710UNc8u1');
    }
    
    if(sc_doc.length === 7) {
      ext_achivster.main(uid, 'zsEwcqJlT568iO9C3MaDeGyskjdZUb');
    }
    
    ua_collection.findOne({uid: uid, service:service}, function(ua_err, ua_doc) {
      for(var i in sc_doc) {
        if(sc_doc[i].service === service) {
          check = false;
        }
      }  
      
      if(sc_err === null && ua_err === null && ua_doc === null) {
        check = true;
      } else {
        check = false;
      }
      cb(check, is_first);
    });
  });
  });
  });
}

function get_user_name_by_service(uid, service, account, cb) {
  var name = '';
  var image = '';
  
  if(service === 'twitter') {
    twitterOA.get('https://api.twitter.com/1.1/account/verify_credentials.json', account.oauth_token, account.oauth_token_secret, function(err, data) {
      data = JSON.parse(data);
      image = data.profile_image_url;
      name = data.name;
      write_name_and_image_from_service(uid, image, name, function() {
        cb();
      });
    });
  }
  
  if(service === 'facebook') {
    var query = {};
    query.info = 'SELECT+pic_big,name+FROM+user+WHERE+uid=me()';
    query = JSON.stringify(query);
    
    var options = {
      host: 'graph.facebook.com',
      method: 'GET'
    };

    options.path = '/fql?q='+query+'&access_token='+account;
  
    var callback = function(response) {
      var str = '';
      response.on('data', function(chunk) {
        str += chunk;
      });

      response.on('end', function() {
        str = JSON.parse(str);
        str = str.data[0].fql_result_set[0];
        name = str.name;
        image = str.pic_big;
        write_name_and_image_from_service(uid, image, name, function() {
          cb();
        });
      });
    };

    https.request(options, callback).end();
  }
  
  if(service === 'vkontakte') {
    var vkontakte = require('vkontakte')(account.access_token);
    vkontakte('users.get', {uids: account.user_id, fields: 'nickname,photo_medium'}, function(err, data) {
      data = data[0];
      name = data.first_name+' '+data.last_name;
      image = data.photo_medium;
      write_name_and_image_from_service(uid, image, name, function() {
        cb();
      });
    });
  }

  if(service === 'bitbucket') {
    bitbucketOA.get('https://api.bitbucket.org/1.0/user', account.token, account.secret, function(err, data){
      data = JSON.parse(data).user;
      image = data.avatar;
      name = data.display_name;
      write_name_and_image_from_service(uid, image, name, function() {
        cb();
      });
    });
  }

  if(service === 'github') {
    var options = {
      host: 'api.github.com',
      method: 'GET',
      path: '/user?access_token='+account.access_token
    };

    var callback = function(response) {
      var str = '';

      response.on('data', function(chunk) {
        str += chunk;
      });

      response.on('end', function() {
        var data = JSON.parse(str);
        image = data.avatar_url;
        name = data.name;
        write_name_and_image_from_service(uid, image, name, function() {
          cb();
        });
      });
    };

    https.request(options, callback).end();
  }
  
  if(service === 'instagram') {
    request.get('https://api.instagram.com/v1/users/'+account.id+'/?access_token='+account.access_token, function(e, r, body){
      name = JSON.parse(body).data.full_name;
      image = JSON.parse(body).data.profile_picture;
      write_name_and_image_from_service(uid, image, name, function() {
        cb();
      });
    });
  }
}

function write_name_and_image_from_service(uid, image, name, cb) {
  uploads.upload_profile_photo_from_url(image, uid, function() {
    db.collection('users_profile', function(ua_err, users_profile) {
      users_profile.update({uid: uid}, {$set: {name: name}}, function(sc_err, sc_doc) {
        cb();
      });
    });
  });
}
