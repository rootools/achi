var app = init.initModels(['config', 'db', 'users']);
var mod = init.initModules(['randomstring']);

var locale = require('../configs/locale/main.js');

exports.login = function(req, res){
  if(!req.session.auth || req.session.auth === false) {
    if(req.body.action) {
      req.body.pass = require('crypto').createHash('md5').update(req.body.pass).digest('hex');

      app.db.conn.collection('users', function(err,collection) {
        if(req.body.action === 'login' && req.body.pass && req.body.email) {
          collection.findOne({email: req.body.email}, function(err, doc) {
            if(doc !== null) {
              if(req.body.pass === doc.password) {
                app.users.addSession(req, doc.uid, doc.email, function() {
                  res.redirect('/');
                  /*if(req.body.redirect_params) {
                    res.redirect('http://api.achivster.com/'+req.body.redirect_params);
                  } else {
                    res.redirect(app.config.site.url);
                  }*/
                });
              } else {
                res.render('login.ect', {error: locale.errors.err1.ru, error_type: 'login'});
              }
            } else {
              res.render('login.ect', {error: locale.errors.err1.ru, error_type: 'login'});
            }
          });
        } else if(req.body.action === 'reg' && req.body.pass && req.body.email) {
          app.users.test(req.body.email, function(flag) {
            if(flag === true) {
              app.users.register(req.body.email, req.body.pass, req, function(){
                res.redirect('/');
              });
            } else {
              res.render('login.ect', {error: locale.errors.err2.ru, error_type: 'register'});
            } 
          });
        } else {
          res.redirect('/');
        }
      });
    } else {
      res.render('login.ect');  
    }
  
  } else {
    res.redirect('/');
  }
};

exports.logout = function(req, res) {
  req.session.auth = false;
  res.redirect('/login');
};