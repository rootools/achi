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
var day = new Date().getTime() - 86400000;

function remove_doubles() {
  db.collection('users_achievements', function(err, collection) {
    collection.find({},{achievements:1 ,uid:1, service:1,_id:0}).toArray(function(err ,doc) {
      for(var i in doc) {
        rem_achiv(doc[i].uid, doc[i].service, doc[i].achievements);
      }
    });
  });
}

function rem_achiv(uid, service, achiv_list) {
  var newArr = [];
  for(var i in achiv_list) {
    if(achiv_list[i].time > day) {
      console.log(achiv_list[i]);
    } else {
      newArr.push(achiv_list[i]);
    }
  }

  db.collection('users_achievements', function(err, collection) {
    collection.update({uid: uid, service: service},{$set: {achievements: newArr}}, function(err,doc){
    });;
  });
}

setTimeout(function() {
  remove_doubles();
}, 500);
