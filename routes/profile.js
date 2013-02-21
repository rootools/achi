var config = require('../configs/config.js');
var async = require('async');
var moment = require('moment');
var uploadjs = require('./upload.js');
var exec = require('child_process').exec;

var db;

var dashboard = require('./dashboard.js');

function mongoConnect() {
  var mongodb = require("mongodb"),
    mongoserver = new mongodb.Server(config.mongo.host, config.mongo.port, config.mongo.server_config),
    db_connector = new mongodb.Db(config.mongo.db, mongoserver, config.mongo.connector_config);

  db_connector.open(function(err, dbs) {
    db = dbs;
  });
}

mongoConnect();

function getServiceList(uid, cb) {
  
  async.parallel({
    all: function(callback) {
      db.collection('services_info', function(err, collection) {
        collection.find({}, {service:1}).toArray(function(err, doc) {
          callback(null, doc);
        });
      });
    },
    added: function(callback) {
      db.collection('services_connections', function(err, collection) {
        collection.find({uid: uid}, {service:1, addtime:1, valid:1, lastupdate:1}).toArray(function(err, doc) {
          callback(null, doc);
        });
      });
    },
    }, function(err, data) {
      var response = data.all;

      for(var i in data.all) {
        for(var r in data.added) {
          // HACK!!
          if(data.all[i].service === 'vkontakte') { response[i].button_icon = '<i class="websymbols">v</i>'}
          if(data.all[i].service === 'facebook') { response[i].button_icon = '<i class="websymbols">f</i>'}
          if(data.all[i].service === 'twitter') { response[i].button_icon = '<i class="websymbols">t</i>'}
          if(data.all[i].service === 'bitbucket') { response[i].button_icon = '<i class="icon-filter"></i>'}
          if(data.all[i].service === 'github') { response[i].button_icon = '<i class="icon-github"></i>'}
          //
          if(data.added[r].service === data.all[i].service) {
            response[i].valid = data.added[r].valid;
            response[i].addtime = moment(data.added[r].addtime).format('DD.MM.YYYY hh:mm');
            response[i].lastupdate = moment(data.added[r].lastupdate).format('DD.MM.YYYY hh:mm');
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

function pointsSum(uid, cb) {
  dashboard.getUserAchievements(uid, function(doc, last, data) {
    var sum = 0;
    for(var i in data) {
      sum += data[i];
    }
    cb(sum);
  });
}

function get_messages(uid, limit, cb) {
  var messages = [];
  db.collection('messages', function(err, collection) {
    collection.find({target_uid: uid}).toArray(function(err, doc) {
      
    var handler = doc.length;
    if(handler === 0) {
      cb([]);
    }
    
    function callback(message) {
      db.collection('users_profile', function(err, collection) {
        collection.findOne({uid: message.owner_uid},{name: 1, _id: 0, photo: 1}, function(err, doc) {
          message.owner_name = doc.name;
          message.time = moment(message.time).format('DD.MM.YYYY hh:mm');
          message.photo = doc.photo;
          messages.push(message);
          handler--;
          if(handler === 0) {
            cb(messages);
          }
        });
      });
    }    
    
    async.forEach(doc, callback, function(err) {});
    });
  });
}

function get_user_profile(uid, cb) {
  db.collection('users_profile', function(err, collection) {
    collection.findOne({uid: uid},{name: 1, _id: 0, photo: 1}, function(err, doc) {
      db.collection('users', function(err, collection) {
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
  db.collection('users_profile', function(err, collection) {
    collection.findOne({uid: uid},{friends: 1, _id: 0}, function(err, doc) {
      
      var friends_uid_list = doc.friends;
      
      var handler = friends_uid_list.length;
      if(handler === 0) {
        cb([]);
      }      
      
      function callback(uid) {
        collection.findOne({uid: uid},{_id: 0, friends: 0}, function(err, profile) {
          pointsSum(uid, function(points) {
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
      
      async.forEach(friends_uid_list, callback, function(err) {});
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

exports.main = function(req, res) {
  if(!req.session.auth || req.session.auth === false) {
    res.redirect(config.site.url);
  } else {
    pointsSum(req.session.uid, function(points) {
      get_messages(req.session.uid, 10, function(messages) {
        get_user_profile(req.session.uid, function(profile) {
          get_friends_list(req.session.uid, function(friends) {
            res.render('profile.ect', { title: 'Profile', session:req.session, points: points, profile: profile, messages: messages, friends: friends} );
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

    db.collection('users_profile', function(err, collection) {
      collection.update({uid: uid}, {$set: query_users_profile}, function(err, doc) {
        // Upload image
        UploadIcon(req.files.image, uid, function() {
          db.collection('users', function(err, collection) {
            collection.update({uid: uid}, {$set: query_users}, function(err, subs) {
              res.redirect('/profile');
            });
          });
        });
      });
    });

  }
}