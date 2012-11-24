var async = require('async');
var moment = require('moment');
var db;

var dashboard = require('./dashboard.js');

function mongoConnect() {
  var mongodb = require("mongodb"),
    mongoserver = new mongodb.Server('127.0.0.1', 27017, {auto_reconnect: true, safe: false}),
    db_connector = new mongodb.Db('achi', mongoserver, '');

  db_connector.open(function(err, dbs) {
    db = dbs;
  });
}

mongoConnect();

function getServiceList(uid, cb) {
  
  async.parallel({
    all: function(callback) {
      db.collection('services_info', function(err, collection) {
        collection.find({}, {service:1}).toArray(function(err, doc) {
          callback(null, doc);
        });
      });
    },
    added: function(callback) {
      db.collection('services_connections', function(err, collection) {
        collection.find({uid: uid}, {service:1, addtime:1, valid:1, lastupdate:1}).toArray(function(err, doc) {
          callback(null, doc);
        });
      });
    },
    }, function(err, data) {
      var response = data.all;

      for(var i in data.all) {
        for(var r in data.added) {
          if(data.added[r].service === data.all[i].service) {
            response[i].valid = data.added[r].valid;
            response[i].addtime = moment(data.added[r].addtime).format('DD.MM.YYYY hh:mm');
            response[i].lastupdate = moment(data.added[r].lastupdate).format('DD.MM.YYYY hh:mm');
          }
        }
      }
      cb(response);
    });
}

function pointsSum(uid, cb) {
  dashboard.getUserAchievements(uid, function(doc, last, data) {
    var sum = 0;
    for(var i in data) {
      sum += data[i];
    }
    cb(sum);
  });
}

function get_messages(uid, limit, cb) {
  var messages = [];
  db.collection('messages', function(err, collection) {
    collection.find({target_uid: uid}).toArray(function(err, doc) {
      
    var handler = doc.length;
    if(handler === 0) {
      cb([]);
    }
    
    function callback(message) {
      db.collection('users_profile', function(err, collection) {
        collection.findOne({uid: message.owner_uid},{name: 1, _id: 0, photo: 1}, function(err, doc) {
          message.owner_name = doc.name;
          message.time = moment(message.time).format('DD.MM.YYYY hh:mm');
          message.photo = doc.photo;
          messages.push(message);
          handler--;
          if(handler === 0) {
            cb(messages);
          }
        });
      });
    }    
    
    async.forEach(doc, callback, function(err) {});
    });
  });
}

function get_user_profile(uid, cb) {
  db.collection('users_profile', function(err, collection) {
    collection.findOne({uid: uid},{name: 1, _id: 0, photo: 1}, function(err, doc) {
      cb(doc);
    });
  });
}

exports.main = function(req, res) {
  pointsSum(req.session.uid, function(points) {
    getServiceList(req.session.uid, function(service_list) {
      get_messages(req.session.uid, 10, function(messages) {
        get_user_profile(req.session.uid, function(profile) {
          res.render('profile.ect', { title: 'Profile', service_list:service_list, session:req.session, points: points, profile: profile, messages: messages} );
        });
      });
    });
  });
};
