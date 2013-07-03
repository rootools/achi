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

function addShortName() {
  db.collection('users_profile', function(err, collection) {
    collection.find({},{uid:1,_id:0}).toArray(function(err ,doc) {
      for(var i in doc) {
        var uid = doc[i].uid;
        collection.update({uid: uid}, {$set: {shortname: uid}}, function(err, doc) {
        });
      }
    });
  });
}

setTimeout(function() {
  addShortName();
}, 500);
