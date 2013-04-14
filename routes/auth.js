var app = init.initModels(['config', 'db', 'users']);
var mod = init.initModules(['randomstring', 'redis']);

var locale = require('../configs/locale/main.js');
var ext_achivster = require('../external/achivster.js');

var red = mod.redis.createClient();
    red.select(6);

exports.login = function(req, res) {
  if(req.body.nosecurity === 'true') {
    req.body.pass = require('crypto').createHash('md5').update(req.body.pass).digest('hex');
  }

  app.db.conn.collection('users', function(err,collection) {

    if(req.body.action === 'login' && req.body.pass && req.body.email) {
      collection.findOne({email: req.body.email}, function(err, doc) {
        if(doc !== null) {
          if(req.body.pass === doc.password) {
            app.users.addSession(req, doc.uid, doc.email, function() {
              if(req.body.redirect_params) {
                res.redirect('http://api.achivster.com/'+req.body.redirect_params);
              } else {
                res.redirect(app.config.site.url);
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
      app.users.test(req.body.email, function(flag) {
        if(flag === true) {
          app.users.register(req.body.email, req.body.pass, req, function(){
            res.redirect(app.config.site.url);
          });
        } else {
          res.render('index.ect', { title: 'Ачивстер', session: req.session, error: locale.errors.err2.ru});
          //res.end(JSON.stringify({error: locale.errors.err2.eng}));
        } 
      });
    } else {
      res.redirect(app.config.site.url);
    }
  });
};

exports.logout = function(req, res) {
  req.session.auth = false;
  res.redirect(app.config.site.url);
};
