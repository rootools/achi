var config = require('../configs/config.js');
var async = require('async');

var db;

var dashboard = require('./dashboard.js');

function mongoConnect() {
  var mongodb = require("mongodb"),
    mongoserver = new mongodb.Server(config.mongo.host, config.mongo.port, config.mongo.server_config),
    db_connector = new mongodb.Db(config.mongo.db, mongoserver, config.mongo.connector_config);

  db_connector.open(function(err, dbs) {
    db = dbs;
  });
}

mongoConnect();

function pointsSum(uid, cb) {
  dashboard.getUserAchievements(uid, function(doc, last, data) {
    var sum = 0;
    for(var i in data) {
      sum += data[i];
    }
    cb(sum);
  });
}

function get_friends_list(uid, cb) {
  var friends_list = [];
  db.collection('users_profile', function(err, collection) {
    collection.findOne({uid: uid},{friends: 1, _id: 0}, function(err, doc) {
      
      var friends_uid_list = doc.friends;
      friends_uid_list.push(uid);
      var handler = friends_uid_list.length;
      if(handler === 0) {
        cb([]);
      }      
      
      function callback(uid) {
        collection.findOne({uid: uid},{_id: 0, friends: 0}, function(err, profile) {
          pointsSum(uid, function(points) {
            profile.points = points;
            if(profile.name === '') { profile.name = 'anonymous'};
            friends_list.push(profile);
            handler--;
            if(handler === 0) {
              friends_list.sort(function(a,b) {
                if (a.points > b.points) {return -1;}
                if (a.points < b.points) {return 1;}
                return 0;
              });
              cb(friends_list);
            }
          });
        });
      }
      
      async.forEach(friends_uid_list, callback, function(err) {});
    });
  });
}


exports.main = function(req, res) {
  get_friends_list(req.session.uid, function(friends_list) {
    res.render('top.ect', { title: 'Top', session:req.session, friends_list: friends_list});
  });
};