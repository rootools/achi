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

exports.index = function(req, res){
  if(!req.session.auth || req.session.auth === false) {
    res.render('index.ect', { title: 'Ачивстер', session: req.session, error: ''});
  } else {
    res.redirect(config.site.url+'dashboard');
  }
};
