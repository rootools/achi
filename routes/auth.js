var config = require('../configs/config.js');
var locale = require('../configs/locale/main.js');
var ext_achivster = require('../external/achivster.js');

var randomstring = require('randomstring');

var redis = require("redis"),
    red = redis.createClient();
    red.select(6);

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
  /*
  if(req.session.auth && req.session.auth === true) {
    res.redirect(config.site.url);
  }*/

  if(req.body.nosecurity === 'true') {
    req.body.pass = require('crypto').createHash('md5').update(req.body.pass).digest('hex');
  }

  db.collection('users', function(err,collection) {

    if(req.body.action === 'login' && req.body.pass && req.body.email) {
      collection.findOne({email: req.body.email}, function(err, doc) {
        if(doc !== null) {
          if(req.body.pass === doc.password) {
            add_session(req, doc.uid, doc.email, function() {
              if(req.body.redirect_params) {
                res.redirect('http://api.achivster.com/'+req.body.redirect_params);
              } else {
                res.redirect(config.site.url);
              }
            });
          } else {
            res.render('index.ect', { title: 'Ачивстер', session: req.session, error: locale.errors.err1.ru});
            //res.end(JSON.stringify({error: locale.errors.err1.eng}));
          }
        } else {
          res.render('index.ect', { title: 'Ачивстер', session: req.session, error: locale.errors.err1.ru});
          //res.end(JSON.stringify({error: locale.errors.err1.eng}));
        }
      });
    } else if(req.body.action === 'reg' && req.body.pass && req.body.email) {
      testUser(req.body.email, function(flag) {
        if(flag === true) {
          registerUser(req.body.email, req.body.pass, req, function(){
            res.redirect(config.site.url);
          });
        } else {
          res.render('index.ect', { title: 'Ачивстер', session: req.session, error: locale.errors.err2.ru});
          //res.end(JSON.stringify({error: locale.errors.err2.eng}));
        } 
      });
    } else {
      res.redirect(config.site.url);
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

function send_mail_confirmation(uid, email, access_key) {
  var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Yandex",
    auth: {
        user: "support@achivster.com",
        pass: "AO4dtGvORf"
    }
  });

  var mailOptions = {
    from: "Achivster Support <support@achivster.com>",
    to: email,
    subject: "Hello", 
    html: '<a href="'+config.site.url+'login/access_key?key='+access_key+'">Подтвердить</a>'
  };

  smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
      console.log(error);
    }else{
      console.log("Message sent: " + response.message);
    }

    smtpTransport.close();
  });
}

function add_default_services(uid, cb) {
  db.collection('services_connections', function(err, services_connections) {
    services_connections.insert({uid: uid, service: 'achivster', service_login: '', addtime: new Date().getTime(), valid: true, lastupdate: new Date().getTime() - 1800000}, function(err, doc) {
      services_connections.insert({uid: uid, service: 'rare', service_login: '', addtime: new Date().getTime(), valid: true, lastupdate: new Date().getTime() - 1800000}, function(err, doc) {
        db.collection('users_achievements', function(err, users_achievements) {  
          users_achievements.insert({uid: uid, service: 'achivster', achievements: []}, function(err, doc) {
            users_achievements.insert({uid: uid, service: 'rare', achievements: []}, function(err, doc) {
console.log('added');
              cb();
            });
          });
        });
      });
    });
  });
}

function registerUser(email, pass, req, cb) {
//            red.get(req.body.invite_key, function(err, uid) {
//              ext_achivster.main(uid, 'lEv3qJs9EGgPDsg7klYVBIJYWYP8mZ');
//            });
  var uid = randomstring.generate(20);
  var access_key = randomstring.generate(40);
  db.collection('users', function(err,collection) {
    collection.insert({email: email, password: pass, uid: uid, subscribes : {week: true, news: true}}, function(err, doc) {
      db.collection('users_profile', function(err,profiles) {
        profiles.insert({uid: uid, name: '', photo: '/images/label.png', friends: []}, function(err, doc) {
          add_default_services(uid, function() {
            ext_achivster.main(uid, 'klxNE51gc8k3jGZYd2i0wAZAPMDviG');
            ext_achivster.rare(uid, 'JdEJC9eomkzMExo7OOYleilpYhlekc');
              add_session(req, uid, email, function() {
                cb();
              });
          });
        });
      });
    });
  });
}

function add_session(req, uid, email, cb) {
  req.session.auth = true;
  req.session.uid = uid;
  req.session.email = email;
  cb();
}

exports.logout = function(req, res) {
  req.session.auth = false;
  res.redirect(config.site.url);
};
