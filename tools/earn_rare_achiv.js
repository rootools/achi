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

var aid = 'JdEJC9eomkzMExo7OOYleilpYhlekc';
//var uid = 'XrxaHkFzCALLSGEmr1Dx';
var service = 'rare';

function write() {
  db.collection('users', function(err, collection) {
    collection.find({},{_id:0, uid:1}).toArray(function(err, doc) {
      for(var i in doc) {
        db.collection('users_achievements', function(err, collection) {
          collection.update({uid:doc[i].uid, service: service}, {$push: {achievements:{aid:aid, time:new Date().getTime()}} }, function(err, doc) {});
        });
      }
    });
  });
}

function writeA() {
  db.collection('users_achievements', function(err, collection) {
    collection.aggregate({$group: { _id: "$uid", serv: {$addToSet: "$service"}}}, function(err, doc) {
      for(var i in doc) {
        if(doc[i].serv.length >= 7) {
          console.log(doc[i]);
        }
      }
    });
  });
}


setTimeout(function() {
  write();
}, 500);
