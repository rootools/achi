var app = init.initModels(['config', 'db', 'users']);
var mod = init.initModules(['randomstring']);

exports.login = function(req, res) {
  req.body.pass = require('crypto').createHash('md5').update(req.body.pass).digest('hex');

  app.db.conn.collection('users', function(err,collection) {
    if(req.body.pass && req.body.email) {
      collection.findOne({email: req.body.email}, function(err, doc) {
        if(doc !== null) {
          if(req.body.pass === doc.password) {
            app.users.addSession(req, doc.uid, doc.email, function() {
              res.json({status: 'ok'});
            });
          } else {
            res.json({error: 'incorrect password'});
          }
        } else {
          res.json({error: 'incorrect email'});
        }
      });
    } else {
      res.json({error: ''}); 
    }
  });            
};

exports.islogin = function(req, res) {
  if(!req.session.auth || req.session.auth === false) {
    res.json({islogin: false});
  } else {
    res.json({islogin: true});
  }
};