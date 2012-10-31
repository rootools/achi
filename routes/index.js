var hd = require('hero-data');
var passwordHash = require('password-hash');
var db;

function mongoConnect() {
  var mongodb = require("mongodb"),
    mongoserver = new mongodb.Server('127.0.0.1', 27017, {auto_reconnect: true, safe: false}),
    db_connector = new mongodb.Db('achi', mongoserver, '');

  db_connector.open(function(err, dbs) {
    db = dbs;
  });
}

mongoConnect();

function getUserAchievements(uid, cb) {
  var achivList = {};
  db.collection('users_achievements', function(err, collection) {
    collection.find({uid:uid},{achievements:1, service:1}).toArray(function(err, doc) {
      cb(doc);
    });
  });
}

exports.index = function(req, res){
  if(!req.session.auth || req.session.auth == false) {
    res.redirect('http://rootools.ru/login');
  } else {
    getUserAchievements(req.session.uid, function(achivList) {    
      res.render('index.ect', { title: 'main' , user: req.session.email, achivList:achivList});
    });
  }
};
