var http = require('http');
var async = require('async');

var cTwitter = require('./qS_twitter');
var cVkontakte = require('./qS_vkontakte');
var cFacebook = require('./qS_facebook');
var cBitbucket = require('./qS_bitbucket');

var q;
var db;

function mongoConnect() {
  var mongodb = require("mongodb"),
    mongoserver = new mongodb.Server('127.0.0.1', 27017, {auto_reconnect: true}),
    db_connector = new mongodb.Db('achi', mongoserver, {safe: true});

  db_connector.open(function(err, dbs) {
    db = dbs;
  });
}

mongoConnect();

function updateQuery(uid, service) {
  var now = new Date().getTime();
  db.collection('services_connections', function(err, collection) {
    collection.update({uid: uid, service:service},{$set: {lastupdate:now}}, function(err, doc) {});
  });
}

function createQuery() {
  var now = new Date().getTime();

  db.collection('services_connections', function(err, collection) {
    collection.find({valid: true, lastupdate: {$lt:now - 1800000}, service:{$nin: ['achivster', 'rare', 'github']}},{service:1, service_login:1, lastupdate:1, uid:1}).toArray(function(err, doc) {
      q = async.queue(function(task, callback) {
        getData(task.service, task.service_login, function(data) {
        if(data.error) {
          console.log(data);
          updateQuery(task.uid, task.service);
          collection.update({uid: task.uid, service: task.service},{$set: {valid: false}}, function(){
            console.log('Set valid=false: '+task.uid+' '+task.service);
          });
          callback();
        } else {
          if(task.service === 'twitter') {
            cTwitter.checkTwitterAchievements(task.uid, data, db, function(res) {
              updateQuery(task.uid, task.service);
              callback();
            });
          }
          if(task.service === 'vkontakte') {
            cVkontakte.checkVkontakteAchievements(task.uid, data, db, function(res) {
              updateQuery(task.uid, task.service);
              callback();
            });
          }
          if(task.service === 'facebook') {
            cFacebook.checkFacebookAchievements(task.uid, data, db, function(res) {
              updateQuery(task.uid, task.service);
              callback();
            });
          }
          if(task.service === 'bitbucket') {
            cBitbucket.checkBitbucketAchievements(task.uid, data, db, function(res) {
              //updateQuery(task.uid, task.service);
              callback();
            });
          }
          if(task.service === 'github') {
            console.log(data);
            callback();
          }
        }
        });
      }, doc.length);

      for(var i=0;i<doc.length;i++) {
        q.push(doc[i], function(err){});
      }

    });
  });
}

function getData(service, auth, cb) {
  if(service == 'twitter') {
    var options = {
        host: 'localhost',
        port: 8065,
        path: '/?oauth_token='+auth.oauth_token+'&oauth_token_secret='+auth.oauth_token_secret};
  }
  
  if(service == 'vkontakte') {
    var options = {
        host: 'localhost',
        port: 8085,
        path: '/?access_token='+auth.access_token+'&uid='+auth.user_id};
  }

  if(service == 'facebook') {
    var options = {
        host: 'localhost',
        port: 8075,
        path: '/?access_token='+auth};
  }

  if(service == 'bitbucket') {
    var options = {
        host: 'localhost',
        port: 8055,
        path: '/?token='+auth.token+'&secret='+auth.secret};
  }

  if(service == 'github') {
    var options = {
        host: 'localhost',
        port: 8045,
        path: '/?token='+auth.access_token};
  }

  var callback = function(res) {
    var str = '';
    res.on('data', function(chunk) {
      str += chunk;
    });

    res.on('error', function(err) {
      console.log(err);
    });

    res.on('end', function() {
      cb(JSON.parse(str));
    });
  };

  http.request(options, callback).end();
}

setInterval(function() {
  if(q === undefined || q.length() === 0) {
    console.log('Run createQuery');
    createQuery();
  }
}, 300000);
