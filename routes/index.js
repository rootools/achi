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

function getUserAchievements(uid, cb) {
  db.collection('users_achievements', function(err, collection) {
    collection.find({uid:uid},{achievements:1, service:1}).toArray(function(err, doc) {
      cb(doc);
    });
  });
}

exports.index = function(req, res){
  console.log(req.session);
  if(!req.session.auth || req.session.auth === false) {
    //res.redirect('http://rootools.ru/login');
    res.render('index.ect', { title: 'main', session: req.session});
  } else {
    getUserAchievements(req.session.uid, function(achivList) {    
      res.render('index.ect', { title: 'main' , session: req.session, achivList:achivList});
    });
  }
};
