var config = init.initModels(['config']).config.mongo;

var mongodb = require("mongodb");
var mongoserver = new mongodb.Server(config.host, config.port, config.server_config);
var db_connector = new mongodb.Db(config.db, mongoserver, config.connector_config);


exports.conn = null;

exports.mongoConnect = function () {
  db_connector.open(function(err, dbs) {
    exports.conn = dbs;
  });
};


exports.mongoConnect();