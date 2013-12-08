var mongodb = require('mongodb');

var mongoserver = new mongodb.Server('127.0.0.1', 27017, {auto_reconnect: true});
var db_connector = new mongodb.Db('achi', mongoserver, {safe: true});

exports.conn = null;

exports.connect = function () {
  db_connector.open(function(err, dbs) {
    exports.conn = dbs;
  });
};

exports.connect();