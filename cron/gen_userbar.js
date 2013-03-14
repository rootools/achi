var ub = require('userbar');
var underscore = require('underscore');

var config = require('../configs/config.js');

var db;

var query = [];

function mongoConnect() {
  var mongodb = require("mongodb"),
    mongoserver = new mongodb.Server(config.mongo.host, config.mongo.port, config.mongo.server_config),
    db_connector = new mongodb.Db(config.mongo.db, mongoserver, config.mongo.connector_config);

  db_connector.open(function(err, dbs) {
    db = dbs;
  });
}

mongoConnect();

function FromQueryToUserbar() {
  for(var i in query) {
    ub.createUserbar(query[i]);
  }
}

function GetPoints(uid, aids, cb) {
  db.collection('achievements', function(err, collection) {
    collection.find({aid: {$in: aids}},{_id: 0, points: 1}).toArray(function(err, doc){
      var points = 0;
      for(var i in doc) {
        points += doc[i].points;
      }
      db.collection('users_profile', function(err, collection) {
        collection.findOne({uid: uid}, {_id: 0, name: 1},function(err, name) {
          name = name.name;
          if(!name) {
            name = '%anonymous%';
          }
          var opt = {ltext: name, rtext: points+' pts', ltextxoffset: 0, rtextxoffset: 0, path: '../public/images/userbars/'+uid+'.png'};
          query.push(opt);
          cb();
        });
      });
    });
  });

}

function Generate() {
  db.collection('users_achievements', function(err, collection) {
    collection.aggregate({$group:{_id: "$uid", achivs: {$addToSet: "$achievements.aid"}}}, function(err, doc){
      var handler = doc.length;
      for(var i in doc) {
        doc[i].achivs = underscore.flatten(doc[i].achivs);
        GetPoints(doc[i]._id, doc[i].achivs, function() {
          handler--;
          if(handler === 0) {
            FromQueryToUserbar();
          }
        });
      }
    });
  });
}


setTimeout(function(){
//setInterval(function(){
  Generate();
//}, 86400000);
}, 1000);
