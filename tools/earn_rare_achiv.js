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

var aid = 'zsEwcqJlT568iO9C3MaDeGyskjdZUb';
var uid = 'hohtg53NK75E3Tb4Fm0A';
var service = 'achivster';

function write() {
  db.collection('users_achievements', function(err, collection) {
    collection.update({uid:uid, service: service}, {$push: {achievements:{aid:aid, time:new Date().getTime()}} }, function(err, doc) {});
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
  //write();
}, 500);
