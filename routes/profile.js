var app = init.initModels(['db', 'config', 'users', 'files', 'mails']);
var mod = init.initModules(['async', 'moment', 'randomstring', 'nodemailer', 'fs', 'redis']);

var red = mod.redis.createClient();
    red.select(6);


exports.get = function(req, res) {
  app.users.getProfile(req.session.uid, function(profile) {
    res.json(profile);
  });
};

exports.save = function(req, res) {
  var uid = req.session.uid;

  var checkName = /^[a-z A-Z а-я А-Я]{3,20}$/.test(req.body.profile.name);
  var checkShortname = /^[a-zA-Z0-9_-]{3,20}$/.test(req.body.profile.shortname);
  
  if(checkName && checkShortname) {

    if(req.body.password && req.body.password_confirm && req.body.password === req.body.password_confirm) {
      var pass = require('crypto').createHash('md5').update(req.body.password).digest('hex');
      var users_query = {subscribes: req.body.profile.subscribes, password: pass};
    } else {
      var users_query = {subscribes: req.body.profile.subscribes};  
    }

    var users_profile_query = {name: req.body.profile.name, shortname: req.body.profile.shortname};
    
    mod.async.parallel([
      function(callback) {
        app.db.conn.collection('users_profile', function(err, collection) {
          collection.update({uid: uid}, {$set: users_profile_query}, function(err, doc) {
            callback();
          });
        });
      },
      function(callback) {
        app.db.conn.collection('users', function(err, collection) {
          collection.update({uid: uid}, {$set: users_query}, function(err, subs) {
            callback();
          });
        });
      }], function() {
        res.json({});
    });
  } else {
    res.json({});
  }
}

exports.save_avatar = function(req, res) {
  app.users.uploadIcon(req.files.file, req.session.uid, function() {
    app.db.conn.collection('users_profile', function(err, collection) {
      collection.update({uid: req.session.uid}, {$set: {photo: '/images/users_photo/'+req.session.uid+'.jpg'}}, function(err, doc) {
        res.redirect('/#/profile');
      });
    });
  });
}

exports.invite_friend = function(req, res) {
  var uid = req.session.uid;
  var email = req.body.email;
  var reg_key = mod.randomstring.generate(40);
  app.users.getName(uid, function(name) {
    app.mails.sendEmailInvite(email, name, reg_key, function() {
      red.set(reg_key, uid, function(err, doc) {
        red.expire(reg_key, 1209600);
        res.redirect('/profile');
      });
    });
  });
}
