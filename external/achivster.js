var config = require('../configs/config.js');

var db;

function mongoConnect() {
  var mongodb = require("mongodb"),
    mongoserver = new mongodb.Server(config.mongo.host, config.mongo.port, config.mongo.server_config),
    db_connector = new mongodb.Db(config.mongo.db, mongoserver, config.mongo.connector_config);

  db_connector.open(function(err, dbs) {
    db = dbs;
  });
}

mongoConnect();

exports.main = function(uid, aid) {
  db.collection('users_achievements', function(err, collection) {
    collection.update({uid:uid, service: 'achivster'}, {$push: {achievements:{aid:aid, time:new Date().getTime()}} }, function(err, doc) {});
  });
};