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

exports.login = function(req, res) {
  
  db.collection('users', function(err,collection) {
    if(req.session.auth && req.session.auth === true) {
      res.redirect('http://rootools.ru/');
    }

    if(req.body.loginEmail && req.body.loginPass) {
      collection.findOne({email: req.body.loginEmail}, function(err, doc) {
        var checkPassword = passwordHash.verify(req.body.loginPass, doc.password);
        if(checkPassword === true) {
          req.session.auth = true;
          req.session.uid = doc.uid;
          req.session.email = doc.email;
          res.end({a:1});
        } else {
          res.end(JSON.stringify({error: 'Error in E-mail or password'}));
        }
      });
    } else if(req.body.regEmail && req.body.regPass && req.body.regPassVerify) {
      testUser(req.body.regEmail, function(flag) {
        if(flag === true) {

        } else {
          res.render('login.ect', { title: 'Login', error: 'This E-mail allready register' });
        } 
      });
    } else {
      res.render('login.ect', { title: 'Login' });
    }
  });
};

function testUser(email, cb) {
  db.collection('users', function(err,collection) {
    collection.findOne({email: email}, function(err, doc) {
      if(doc !== null) { 
        cb(false);
      } else {
        cb(true);
      }
    });
  });  
}

exports.logout = function(req, res) {
  req.session.auth = false;
  res.redirect('http://rootools.ru/login');
};
