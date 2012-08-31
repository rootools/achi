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

exports.login = function(req, res) {

  if(req.session.auth && req.session.auth == true) {
    res.redirect('http://37.230.112.90/');
  }

  if(req.body.loginEmail && req.body.loginPass) {
    db.collection('users', function(err,collection) {
      collection.findOne({email: req.body.loginEmail}, function(err, doc) {
        var checkPassword = passwordHash.verify(req.body.loginPass, doc.password);
        if(checkPassword == true) {
          req.session.auth = true;
          req.session.uid = doc.uid;
          req.session.email = doc.email;
          req.session.nickname = doc.nickname;
          res.redirect('http://37.230.112.90/');
        } else {
          res.render('login', { title: 'Login' });
        }
      });
    });
  } else {
    res.render('login', { title: 'Login' });
  }
};

exports.logout = function(req, res) {
  req.session.auth = false;
  res.redirect('http://37.230.112.90/login');
};
