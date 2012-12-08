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

exports.main = function(req, res) {
  var uid = req.params.id;
  db.collection('users', function(err, collection) {
    collection.findOne({uid:uid}, function(err, doc) {
      if(doc === null) {
        res.end();  
      } else {
        res.render('user.ect', { title: 'User', session: req.session});
      }
    });
  });
};