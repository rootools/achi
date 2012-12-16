var config = require('../configs/config.js');
var locale = require('../configs/locale/main.js');
var ext_achivster = require('../external/achivster.js');

var geoip = require('geoip-lite');
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
  console.log(req.session);
  var region = '';
  //var region = geoip.lookup(req.connection.remoteAddress).country;
  db.collection('users', function(err,collection) {
    if(req.session.auth && req.session.auth === true) {
      res.redirect(config.site.url);
    }

    if(req.body.action === 'login') {
      collection.findOne({email: req.body.email}, function(err, doc) {
        if(doc !== null) {
          if(req.body.pass === doc.password) {
            add_session(req, doc.uid, doc.email, region, function() {
              res.end(JSON.stringify({}));
            });
          } else {
            res.end(JSON.stringify({error: locale.errors.err1.eng}));
          }
        } else {
          res.end(JSON.stringify({error: locale.errors.err1.eng}));
        }
      });
    } else if(req.body.action === 'reg') {
      testUser(req.body.email, function(flag) {
        if(flag === true) {
          registerUser(req.body.email, req.body.pass, region, req, function(){
            res.end(JSON.stringify({}));
          });
        } else {
          res.end(JSON.stringify({error: locale.errors.err2.eng}));
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

function registerUser(email, pass, region, req, cb) {
  var uid = randomstring.generate(20);
  db.collection('users', function(err,collection) {
    collection.insert({email: email, password: pass, uid: uid}, function(err, doc) {
      db.collection('users_profile', function(err,profiles) {
        profiles.insert({uid: uid, name: '', photo: '/images/label.png', friends: []}, function(err, doc) {
          db.collection('services_connections', function(err, services_connections) {
            services_connections.insert({uid: uid, service: 'achivster', service_login: '', addtime: new Date().getTime(), valid: true, lastupdate: new Date().getTime() - 1800000}, function(err, doc) {
              db.collection('users_achievements', function(err, users_achievements) {  
                users_achievements.insert({uid: uid, service: 'achivster', achievements: []}, function(err, doc) {});
                ext_achivster.main(uid, 'klxNE51gc8k3jGZYd2i0wAZAPMDviG');
                add_session(req, uid, email, region, function() {
                  cb();
                });
              });
            });
          });
        });
      });
    });
  });
}

function add_session(req, uid, email, lang, cb) {
  req.session.auth = true;
  req.session.uid = uid;
  req.session.email = email;
  req.session.lang = lang;
  cb();
}

exports.logout = function(req, res) {
  req.session.auth = false;
  res.redirect(config.site.url);
};
