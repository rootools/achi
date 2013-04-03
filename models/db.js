var config = init.initModels(['config']).config.mongo;

var mongodb = require("mongodb");
var mongoserver = new mongodb.Server(config.host, config.port, config.server_config);
var db_connector = new mongodb.Db(config.db, mongoserver, config.connector_config);
var db_connector_api = new mongodb.Db(config.db_api, mongoserver, config.connector_config);


exports.conn = null;
exports.conn_api = null;

exports.connect = function () {
  db_connector.open(function(err, dbs) {
    exports.conn = dbs;
  });
};

exports.connectApi = function () {
  db_connector_api.open(function(err, dbs) {
    exports.conn_api = dbs;
  });
}

exports.connect();
exports.connectApi();