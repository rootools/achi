var passwordHash = require('password-hash');
var randomstring = require('randomstring');
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

    if(req.body.action === 'login') {
      collection.findOne({email: req.body.email}, function(err, doc) {
        var checkPassword = passwordHash.verify(req.body.pass, doc.password);
        if(checkPassword === true) {
          req.session.auth = true;
          req.session.uid = doc.uid;
          req.session.email = doc.email;
          res.end(JSON.stringify({}));
        } else {
          res.end(JSON.stringify({error: 'Error in E-mail or password'}));
        }
      });
    } else if(req.body.action === 'reg') {
      testUser(req.body.email, function(flag) {
        if(flag === true) {
          registerUser(req.body.email, req.body.pass);
          res.end(JSON.stringify({}));
        } else {
          res.end(JSON.stringify({error: 'This E-mail allready register' }));
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

function registerUser(email, pass) {
  db.collection('users', function(err,collection) {
    collection.insert({email: email, password: passwordHash.generate(pass), uid: randomstring.generate(20)}, function(err, doc) {
      if(err) {
        cb('DB error');
      }
    });
  });
}

exports.logout = function(req, res) {
  req.session.auth = false;
  res.redirect('http://rootools.ru/');
};
