var config = require('../configs/config.js');
var locale = require('../configs/locale/main.js');

var randomstring = require('randomstring');
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

exports.login = function(req, res) {
  db.collection('users', function(err,collection) {
    if(req.session.auth && req.session.auth === true) {
      res.redirect('http://rootools.ru/');
    }

    if(req.body.action === 'login') {
      collection.findOne({email: req.body.email}, function(err, doc) {
        if(req.body.pass === doc.password) {
          req.session.auth = true;
          req.session.uid = doc.uid;
          req.session.email = doc.email;
          res.end(JSON.stringify({}));
        } else {
          res.end(JSON.stringify({error: locale.errors.err1.eng}));
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
    collection.insert({email: email, password: pass, uid: randomstring.generate(20)}, function(err, doc) {
      db.collection('users_profile', function(err,profiles) {
        profiles.insert({uid: doc[0].uid, name: '', photo: '/images/label.png', friends: []}, function(err, doc) {
        });
      });
    });
  });
}

exports.logout = function(req, res) {
  req.session.auth = false;
  res.redirect('http://rootools.ru/');
};
