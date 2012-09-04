var http = require('http');
var querystring = require('querystring');
var hd = require('hero-data');

var cTwitter = require('./qS_twitter.js');

var redis = require("redis"),
    client = redis.createClient();
    client.select(6);

var db;

var queryLauncherHandler = 0;

function mongoConnect() {
  var mongodb = require("mongodb"),
    mongoserver = new mongodb.Server('127.0.0.1', 27017, {auto_reconnect: true}),
    db_connector = new mongodb.Db('achi', mongoserver, '');

  db_connector.open(function(err, dbs) {
    db = dbs;
  });
}

mongoConnect();

function getServiceConnections(uid, cb) {
  db.collection('services_connections', function(err, collection) {
    collection.find({},{service:1, service_login:1}).toArray(function(err, doc) {
      cb(doc, uid);
    });
  });
}

function updateQuery(uid, service) {
  var now = new Date().getTime();
  client.del(uid+'|'+service);
  db.collection('users_profile', function(err, collection) {
    collection.update({uid: uid},{$set: {lastupdate:now}});
  });
}

function createQuery() {
  db.collection('users_profile', function(err, collection) {
    collection.find({},{uid:1, lastupdate:1}).toArray(function(err, doc) {
      var now = new Date().getTime();
      for(var i=0;i<doc.length;i++) {
        if(doc[i].lastupdate == '' || doc[i].lastupdate + 1800000 < now) {
          getServiceConnections(doc[i].uid, function(servList, uid) {
            for(var r=0;r<servList.length;r++) {
              client.set(uid+'|'+servList[r].service, now);
            }
          });
        }
      }
    });
  });
}

function queryLauncher() {
  client.keys('*', function(err, queryList) {
    queryLauncherHandler = queryList.length;
    for(var i=0;i<queryList.length;i++) {
      var data = queryList[i].split('|');
      var uid = data[0];
      var service = data[1];
      db.collection('services_connections', function(err, collection) {
        collection.findOne({uid:uid, service:service},{service_login:1}, function(err, doc) {
          getData(service, doc.service_login, function(result) {
            if(service == 'twitter') {
              cTwitter.checkTwitterAchievements(uid, result, db, function(res) {
                queryLauncherHandler--;
                updateQuery(uid, service);
              });  
            }
          });
        });
      });
    }
  });  
}

setInterval(function() {
  console.log('Run createQuery');
  createQuery();
}, 1800000);

setInterval(function() {
  console.log('Run queryLauncher');
  console.log(queryLauncherHandler);
  if(queryLauncherHandler == 0) {
    queryLauncher();
  }
}, 900000);

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

/*getData('twitter', 'rootools', function(data) {
  var uid = 'iyh1xfsMNwYp3DigmBuX';
  cTwitter.checkTwitterAchievements(uid, data, db, function(res) {
  });
});*/
