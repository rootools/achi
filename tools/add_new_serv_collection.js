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

function add_new_sc() {
  db.collection('users', function(err, collection) {
    collection.find({},{uid:1,_id:0}).toArray(function(err ,doc) {
      for(var i in doc) {
        var uid = doc[i].uid;
        db.collection('users_achievements', function(err, users_achievements) {  
          users_achievements.insert({uid: uid, service: 'rare', achievements: []}, function(err, doc) {

        //db.collection('services_connections', function(err, collection) {
          //collection.insert({uid: uid, service: 'rare', service_login: '', addtime: new Date().getTime(), valid: true, lastupdate: new Date().getTime() - 1800000}, function(err, doc) {
          //});
        //});
        });
        });
      }
    });
  });
}

setTimeout(function() {
  add_new_sc();
}, 500);
