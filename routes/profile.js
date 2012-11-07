var async = require('async');
var moment = require('moment');
var db;

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

exports.main = function(req, res) {
  getServiceList(req.session.uid, function(service_list) {
    res.render('profile.ect', { title: 'Profile', service_list:service_list} );
  });
};
