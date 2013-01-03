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

var aid = 'h91mpQsZ053OugI2EcDWZkn1fohAbY';
var uid = 'TZ4fd9uuy94G5QIl1B4b';

function write() {
  db.collection('users_achievements', function(err, collection) {
    collection.update({uid:uid, service: 'rare'}, {$push: {achievements:{aid:aid, time:new Date().getTime()}} }, function(err, doc) {});
  });
}


setTimeout(function() {
  write();
}, 500);
