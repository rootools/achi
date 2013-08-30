init = require('../init.js');

var async = require("async");
var http = require("http");

var ext_achivster = require('../external/achivster.js');

var config = {
  db: 'achi',
  port: 27017,
  host: '127.0.0.1',
  server_config: {
    auto_reconnect: true
  },
  connector_config: {
    safe: true
  }
};

var db;
var mongodb = require("mongodb");
var mongoserver = new mongodb.Server(config.host, config.port, config.server_config);
var db_connector = new mongodb.Db(config.db, mongoserver, config.connector_config);

db_connector.open(function(err, dbs) {
  db = dbs;
});

var services = {
  'twitter': require('./qS_twitter'),
  'vkontakte': require('./qS_vkontakte'),
  'facebook': require('./qS_facebook'),
  'bitbucket': require('./qS_bitbucket'),
  'github': require('./qS_github'),
  'instagram': require('./qS_instagram'),
  'foursquare': require('./qS_foursquare'),
  'odnoklassniki': require('./qS_odnoklassniki'),
  'steam': require('./qS_steam'),
  'twitch': require('./qS_twitch'),
};

var q;

function addUserAchievement(uid, aid, service) {
  db.collection('users_achievements', function(err,collection) {
    collection.update({uid:uid, service: service}, {$push: {achievements:{aid:aid, time:new Date().getTime()}} }, function(err, doc) {
//      ext_achivster.thousand(uid);
    });
  });
}

function getUserAchievementsByService(uid, service, cb) {
  db.collection('users_achievements', function(err, collection) {
    collection.findOne({uid: uid, service: service}, function(err, doc) {
      if(doc.achievements === undefined) { doc.achievements = [];}
      cb(err, doc.achievements);
    });
  });
}

function getAchivmentsByService(service, cb) {
  db.collection('achievements', function(err,collection) {
    collection.find({service: service},{aid: 1}).toArray(function(err, docs) {
      cb(err, docs);
    });
  });
}

function updateQuery(uid, service) {
  var now = new Date().getTime();
  db.collection('services_connections', function(err, collection) {
    collection.update({uid: uid, service:service},{$set: {lastupdate:now}}, function(err, doc) {});
  });
}

function createAIDarray(data) {
  var newArray = [];
  for(var i=0;i<data.length;i++) {
    newArray.push(data[i].aid);
  }
  return newArray;
}

function dump_unknown(all, list) {
  var dump = [];
  // Ban badges
//  all.push('000000510ad6a2011c1712eb17a700');
  for(var n in list) {
    if(all.indexOf('000000'+list[n].badgeId) === -1) {
      dump.push(list[n]);
    }
  }
  console.log(dump);
}

function createQuery() {
  var now = new Date().getTime();

  db.collection('services_connections', function(err, collection) {
    collection.find({type: 'internal', valid: true, lastupdate: {$lt:now - 3600000}, service:{$nin: ['achivster', 'rare']}},{service:1, service_login:1, lastupdate:1, uid:1}).toArray(function(err, doc) {
      console.log(doc.length);
      q = async.queue(function(task, callback) {

        if (typeof services[task.service] != "undefined") {
          
          getData(task.service, task.service_login, function(data) {
            if(data.error) {
              updateQuery(task.uid, task.service);
              collection.update({uid: task.uid, service: task.service},{$set: {valid: false}}, function(){
                console.log('Set valid=false: '+task.uid+' '+task.service);
                callback();
              });
            } else if(data.notavailable) {
              updateQuery(task.uid, task.service);
              callback();
            } else {

              async.parallel({
                users: function(cb) { getUserAchievementsByService(task.uid, task.service, cb); },
                all: function(cb) { getAchivmentsByService(task.service, cb); },
                }, function(err, res) {
                  res.all = createAIDarray(res.all);
                  res.users = createAIDarray(res.users);
                  if(res.users === undefined || res.users.length === 0) {res.users = [];}
                  var notRecieved = [];

                  if (task.service == 'foursquare') {
                    // Dump unknown achivs
                    dump_unknown(res.all, data);
                  }

                  for(var i in res.all) {
                    if(res.users.indexOf(res.all[i]) === -1) {
                      notRecieved.push(res.all[i]);
                    }
                  }

                  for(var i=0;i<notRecieved.length;i++) {
                    var name = notRecieved[i];
                    if (typeof services[task.service].functions[name] == 'function') {
                      if (services[task.service].functions[name](data)) {
                        addUserAchievement(task.uid, name, task.service);
                      }
                    }
                  }

                  updateQuery(task.uid, task.service);
                  callback();

                }
              );

            }
          });

        }

      }, doc.length);

      for(var i in doc) {
        q.push(doc[i], function(err){});
      }

    });
  });
}

function getData(service, auth, cb) {

  var options = services[service].options(auth);

  var callback = function(res) {
    var str = '';
    res.on('data', function(chunk) {
      str += chunk;
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
