var config = require('../configs/config.js');
var app = init.initModels(['users']);

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


function TestAllreadyEarned(uid, aid, cb) {
  db.collection('users_achievements', function(err, collection) {
    collection.findOne({uid: uid, service: 'achivster'}, {_id: 0, achievements: 1}, function(err, doc) {
      var list = doc.achievements;
      var flag = true;
      for(var i in list) {
        if(list[i].aid === aid) {
          flag = false;
        }
      }
      cb(flag);
    });
  });
}

function write(uid, aid) {
  TestAllreadyEarned(uid, aid, function(check) {
  if(check) {
    db.collection('users_achievements', function(err, collection) {
      collection.update({uid:uid, service: 'achivster'}, {$push: {achievements:{aid:aid, time:new Date().getTime()}} }, function(err, doc) {});
    });
  }
  });
}

exports.main = function(uid, aid) {
  write(uid, aid);
};

exports.rare = function(uid, aid) {
  db.collection('users_achievements', function(err, collection) {
    collection.update({uid:uid, service: 'rare'}, {$push: {achievements:{aid:aid, time:new Date().getTime()}} }, function(err, doc) {});
  });
};

exports.check_first_friend = function(uid) {
  db.collection('users_achievements', function(err, users_achievements) {
    users_achievements.findOne({uid: uid, service: 'achivster'}, {_id: 0, achievements: 1}, function(err, achiv_list) {
      achiv_list = achiv_list.achievements;
      for(var i in achiv_list) {
        if(achiv_list[i].aid === 'xfRYH7bizdL9GgvPnhjgJlKedF18uj') {
          return;
        }
      }
      write(uid, 'xfRYH7bizdL9GgvPnhjgJlKedF18uj');
    });
  });
};

exports.thousand = function(uid) {
  TestAllreadyEarned(uid, 'nTqbJqaOI0OMj6FqzxVJ02uTs76GeH', function(check) {
    if(check) {
      app.getPointSum(uid, function(points) {
        if(points >= 1000) {
          write(uid, 'nTqbJqaOI0OMj6FqzxVJ02uTs76GeH');
        }
      });
    }
  });
};

function getPointSum (uid, cb) {
  db.conn.collection('users_achievements', function(err, collection) {
    collection.find({uid: uid},{achievements: 1, _id: 0}).toArray(function(err, doc) {

    var aids = [];

    for(var i in doc) {
      for(var r in doc[i].achievements) {
        aids.push(doc[i].achievements[r].aid);
      }
    }

    if(aids.length === 0) {
      cb(0);
    } else {
      db.conn.collection('achievements', function(err, collection) {
        collection.find({aid: {$in: aids}}, {points:1, _id: 0}).toArray(function(err, doc) {
          var points = 0;
          for(var i in doc) {
            points += doc[i].points;
          }
          cb(points);
        });
      });
    }

    });
  });
};