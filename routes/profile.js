var init = require('../init.js');
var uploadjs = require('./upload.js');
var exec = require('child_process').exec;

var mail_layout;

var app = init.initModels(['db', 'config', 'users']);
var mod = init.initModules(['async', 'moment', 'randomstring', 'nodemailer', 'fs']);

var redis = require("redis"),
    red = redis.createClient();
    red.select(6);

function GetMailLayout() {
  mod.fs.readFile('./mailer/layout.html', 'utf8', function (err, layout) {
    mod.fs.readFile('./mailer/invite_friend.html', 'utf8', function (err, restore) {
      mail_layout = layout.replace('||content||', restore);
    });
  });
}

GetMailLayout();

function getServiceList(uid, cb) {
  
  mod.async.parallel({
    all: function(callback) {
      app.db.conn.collection('services_info', function(err, collection) {
        collection.find({}, {service:1}).toArray(function(err, doc) {
          callback(null, doc);
        });
      });
    },
    added: function(callback) {
      app.db.conn.collection('services_connections', function(err, collection) {
        collection.find({uid: uid}, {service:1, addtime:1, valid:1, lastupdate:1}).toArray(function(err, doc) {
          callback(null, doc);
        });
      });
    },
    }, function(err, data) {
      var response = data.all;

      for(var i in data.all) {
        for(var r in data.added) {
          if(data.added[r].service === data.all[i].service) {
            response[i].valid = data.added[r].valid;
            response[i].addtime = mod.moment(data.added[r].addtime).format('DD.MM.YYYY hh:mm');
            response[i].lastupdate = mod.moment(data.added[r].lastupdate).format('DD.MM.YYYY hh:mm');
          }
        }
      }
      
      // TRASH!!!
      for(var j in response) {
        if(response[j].service === 'rare') {
          response.splice(j,1);
        }
      }
      
      for(var j in response) {
        if(response[j].service === 'achivster') {
          response.splice(j,1);
        }
      }

      cb(response);
    });
}

function get_messages(uid, limit, cb) {
  var messages = [];
  app.db.conn.collection('messages', function(err, collection) {
    collection.find({target_uid: uid}).toArray(function(err, doc) {
      
    var handler = doc.length;
    if(handler === 0) {
      cb([]);
    }
    
    function callback(message) {
      app.db.conn.collection('users_profile', function(err, collection) {
        collection.findOne({uid: message.owner_uid},{name: 1, _id: 0, photo: 1}, function(err, doc) {
          message.owner_name = doc.name;
          message.time = mod.moment(message.time).format('DD.MM.YYYY hh:mm');
          message.photo = doc.photo;
          messages.push(message);
          handler--;
          if(handler === 0) {
            cb(messages);
          }
        });
      });
    }    
    
    mod.async.forEach(doc, callback, function(err) {});
    });
  });
}

function get_user_profile(uid, cb) {
  app.db.conn.collection('users_profile', function(err, collection) {
    collection.findOne({uid: uid},{name: 1, _id: 0, photo: 1}, function(err, doc) {
      app.db.conn.collection('users', function(err, collection) {
        collection.findOne({uid: uid},{subscribes: 1, _id: 0}, function(err, subs) {
          doc.subscribes = subs.subscribes;
          cb(doc);
        });
      });
    });
  });
}

function get_friends_list(uid, cb) {
  var friends_list = [];
  app.db.conn.collection('users_profile', function(err, collection) {
    collection.findOne({uid: uid},{friends: 1, _id: 0}, function(err, doc) {
      
      var friends_uid_list = doc.friends;
      
      var handler = friends_uid_list.length;
      if(handler === 0) {
        cb([]);
      }      
      
      function callback(uid) {
        collection.findOne({uid: uid},{_id: 0, friends: 0}, function(err, profile) {
          app.users.GetPointSum(uid, function(points) {
            profile.points = points;
            if(profile.name === '') { profile.name = 'anonymous'};
            friends_list.push(profile);
            handler--;
            if(handler === 0) {
              cb(friends_list);
            }
          });
        });
      }
      
      mod.async.forEach(friends_uid_list, callback, function(err) {});
    });
  });
}

function UploadIcon(image, uid, cb) {
  var file = image.path.split('/')[1];
  uploadjs.convertImage('./uploads/', file, uid, function() {
    exec('mv uploads/'+uid+'.jpg public/images/users_photo/', function(error, stdout, stderr) {
      cb();
    });
  });
}

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

function GetNameByUid(uid, cb) {
  app.db.conn.collection('users_profile', function(err, collection) {
    collection.findOne({uid: uid},{name: 1, _id: 0}, function(err, doc) {
      cb(doc.name);
    });
  });
}

exports.main = function(req, res) {
  if(!req.session.auth || req.session.auth === false) {
    res.redirect(config.site.url);
  } else {
    app.users.GetPointSum(req.session.uid, function(points) {
      get_messages(req.session.uid, 10, function(messages) {
        get_user_profile(req.session.uid, function(profile) {
          get_friends_list(req.session.uid, function(friends) {
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
        UploadIcon(req.files.image, uid, function() {
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
    GetNameByUid(uid, function(name) {
      SendEmailInvite(email, name, reg_key, function() {
        red.set(reg_key, uid, function(err, doc) {
          red.expire(reg_key, 1209600);
          res.redirect('/profile');
        });
      });
    });
  }
}