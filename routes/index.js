var hd = require('hero-data');
var passwordHash = require('password-hash');
var db;

function mongoConnect() {
  var mongodb = require("mongodb"),
    mongoserver = new mongodb.Server('127.0.0.1', 27017, {auto_reconnect: true}),
    db_connector = new mongodb.Db('achi', mongoserver, '');

  db_connector.open(function(err, dbs) {
    db = dbs;
  });
}

mongoConnect();

exports.index = function(req, res){
  if(!req.session.auth || req.session.auth == false) {
    res.redirect('http://37.230.112.90/login');
  } else {
    res.render('index', { title: 'Express' , user: req.session.email});
  }
};
