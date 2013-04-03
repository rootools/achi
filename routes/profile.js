var app = init.initModels(['db', 'config', 'users', 'files']);
var mod = init.initModules(['async', 'moment', 'randomstring', 'nodemailer', 'fs', 'redis']);

var mail_layout;

var red = mod.redis.createClient();
    red.select(6);

function GetMailLayout() {
  mod.fs.readFile('./mailer/layout.html', 'utf8', function (err, layout) {
    mod.fs.readFile('./mailer/invite_friend.html', 'utf8', function (err, restore) {
      mail_layout = layout.replace('||content||', restore);
    });
  });
}

GetMailLayout();

function SendEmailInvite(email, name, key, cb) {
  var smtpTransport = mod.nodemailer.createTransport("SMTP",{
    service: "Yandex",
    auth: {
        user: "support@achivster.com",
        pass: "AO4dtGvORf"
    }
  });

  var html = mail_layout.replace('||username||', '<b>'+name+'</b>');
  html = html.replace('||key||', key);
  console.log(html);

  var mailOptions = {
    from: "Achivster Support <support@achivster.com>",
    to: email,
    subject: "Получи свое первое достижение!", 
    html: html
  };

  smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
      console.log(error);
    }else{
      console.log("Message sent: " + response.message);
    }

    smtpTransport.close();
    cb();
  });
}

exports.main = function(req, res) {
  if(!req.session.auth || req.session.auth === false) {
    res.redirect(config.site.url);
  } else {
    app.users.getPointSum(req.session.uid, function(points) {
      app.users.getMessages(req.session.uid, 10, function(messages) {
        app.users.getProfile(req.session.uid, function(profile) {
          app.users.getFriendsList(req.session.uid, function(friends) {
            res.render('profile.ect', { title: 'Профиль', session:req.session, points: points, profile: profile, messages: messages, friends: friends} );
          });
        });
      });
    });
  }
};

exports.save = function(req, res) {
  if(!req.session.auth || req.session.auth === false) {
    res.redirect(config.site.url);
  } else {
    var uid = req.session.uid;

    // Remove clear fields
    var query = {};
    var query_users = {};
    query_users.subscribes = {};
    query_users.subscribes.news = false;
    query_users.subscribes.week = false;
    var query_users_profile = {};

    for(var i in req.body) {
      if(req.body[i].length > 0) {
        query[i] = req.body[i];
      }
    }

    // Create query to 'users' collection
    for(var i in query) {
      if(i === 'password') {
        query_users[i] = require('crypto').createHash('md5').update(query[i]).digest('hex');
      }
      if(i === 'subs_news') {
        query_users.subscribes.news = true;
      }
      if(i === 'subs_week') {
        query_users.subscribes.week = true;
      }
    }

    // Create query to 'users_profile' collection
    
    if(req.files.image.size != 0) {
      query_users_profile.photo = '/images/users_photo/'+uid+'.jpg';
    }

    for(var i in query) {
      if(i === 'name') {
        query_users_profile[i] = query[i];
      }
    }

    app.db.conn.collection('users_profile', function(err, collection) {
      collection.update({uid: uid}, {$set: query_users_profile}, function(err, doc) {
        // Upload image
        app.users.uploadIcon(req.files.image, uid, function() {
          app.db.conn.collection('users', function(err, collection) {
            collection.update({uid: uid}, {$set: query_users}, function(err, subs) {
              res.redirect('/profile');
            });
          });
        });
      });
    });

  }
}

exports.invite_friend = function(req, res) {
  if(!req.session.auth || req.session.auth === false) {
    res.redirect(config.site.url);
  } else {
    var uid = req.session.uid;
    var email = req.body.email;
    var reg_key = mod.randomstring.generate(40);
    app.users.getName(uid, function(name) {
      SendEmailInvite(email, name, reg_key, function() {
        red.set(reg_key, uid, function(err, doc) {
          red.expire(reg_key, 1209600);
          res.redirect('/profile');
        });
      });
    });
  }
}
