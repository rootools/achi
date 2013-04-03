var app = init.initModels(['users']);
var mod = init.initModules(['randomstring', 'redis', 'nodemailer', 'fs']);

var locale = require('../configs/locale/main.js');
var ext_achivster = require('../external/achivster.js');

var functions = {}

function routing(req, res) {
  if(req.session.auth === true) {
    var func_name = req.body.action;
    if (typeof functions[func_name] == 'function') {
      functions[func_name](req, res);
    } else {
      console.log('Error Method ' + func_name);
      res.end('');
    }
  } else {
    res.end('');
  }
}

functions.getAchievementsList = function (req, res) {
  db.collection('achievements', function(err,collection) {
    collection.find({service:req.body.service}).sort({position: 1}).toArray(function(err, data) {
      res.end(JSON.stringify(data));
    });
  });
}

functions.userAchievementsList = function (req, res) {
  db.collection('users_achievements', function(err,collection) {
    collection.findOne({uid:req.session.uid, service:req.body.service},{achievements:1},function(err ,data) {
      res.end(JSON.stringify(data));
    });
  });
}

functions.find_by_email = function (req, res) {
  var email = req.body.email;
  if(email === req.session.email) {
    res.end(JSON.stringify({error: 'It`s You!'}));
  }
  
  db.collection('users', function(err,collection) {
    collection.findOne({email: email},{uid: 1, _id: 0, email: 1}, function(err, doc) {
      if(doc === null) {
        res.end(JSON.stringify({error: 'Did not match'}));
      } else {
        db.collection('users_profile', function(err,profile) {
          profile.findOne({uid: doc.uid},{_id: 0, name: 1, photo: 1, friends: 1}, function(err, profile) {
            for(var r in profile.friends) {
              if(profile.friends[r] === req.session.uid) {
                res.end(JSON.stringify({error: 'Allready your friend'}));
              }
            }
            app.users.getAchievements(doc.uid, function(smth, last, data) {
              if(last.length === 0) {
                doc.last = '';
              } else {
                doc.last = last[0].name;  
              }
              var sum = 0;
              for(var i in data) {
                sum += data[i];
              }
              doc.points = sum;
              doc.name = profile.name;
              doc.photo = profile.photo;
              
              res.end(JSON.stringify(doc));
            });
      
          });
        });
      }
    });
  });
}

functions.get_name_by_uid = function (uid, cb) {
  db.collection('users_profile', function(err,collection) {
    collection.findOne({uid:uid},{name: 1, _id: 0}, function(err, doc) {
      cb(doc.name);
    });
  });
}

functions.send_friendship_request = function (req, res) {
  var target_uid = req.body.uid;
  var owner_uid = req.session.uid;
  get_name_by_uid(owner_uid, function(name) {
    db.collection('messages', function(err,collection) {
      collection.findOne({$or: [{owner_uid: owner_uid, target_uid: target_uid},{owner_uid: target_uid, target_uid: owner_uid}], type: 'friendship_request'}, function(err, doc) {
        if(doc !== null) {
          if(doc.owner_uid === target_uid) {
            res.end(JSON.stringify({message: locale.messages.mes2.ru}));
          } else {
            res.end(JSON.stringify({message: locale.messages.mes1.ru}));
          }
        } else {
          var data = 'You are invited to be a friend with '+name;
          collection.insert({owner_uid: owner_uid, target_uid: target_uid, type: 'friendship_request', time: new Date().getTime(), data: data}, function(err, doc){});
          res.end(JSON.stringify({message: locale.messages.mes3.ru}));
        }
      });
    });
  });
}

functions.friendship_accept_or_reject = function (req, res) {
  var command = req.body.command;
  var owner_uid = req.body.owner_uid;
  var target_uid = req.body.target_uid;
  db.collection('messages', function(err,collection) {
    if(command === 'reject') {
      
    }
    if(command === 'accept') {
      db.collection('users_profile', function(err, profile) {
        profile.update({uid: owner_uid},{$push: {friends: target_uid}}, function(err, doc) {});
        profile.update({uid: target_uid},{$push: {friends: owner_uid}}, function(err, doc) {});
      });
      ext_achivster.check_first_friend(owner_uid);
    }
    collection.remove({owner_uid: owner_uid, target_uid: target_uid}, function(err, doc){});
  });
  res.end(JSON.stringify({}));
}

functions.remove_friendship = function (req, res) {
  var uid = req.session.uid;
  var friends_uid = req.body.friends_uid;
  remove_friend_by_uid(uid, friends_uid);
  remove_friend_by_uid(friends_uid, uid);
  res.end(JSON.stringify({}));
}

functions.remove_friend_by_uid = function (uid, friends_uid) {
  db.collection('users_profile', function(err,collection) {
    collection.findOne({uid: uid},{friends: 1, _id:0}, function(err, doc) {
      var friends_list = doc.friends;
      var new_friends_list = [];
      for(var i in friends_list) {
        if(friends_list[i] !== friends_uid) {
          new_friends_list.push(friends_list[i]);
        }
      }
      collection.update({uid: uid},{$set: {friends: new_friends_list}}, function(err, doc){});
    });
  });
}

functions.restore_friendship = function (req, res) {
  var uid = req.session.uid;
  var friends_uid = req.body.friends_uid;
  db.collection('users_profile', function(err,collection) {
    collection.update({uid: uid},{$push: {friends: friends_uid}}, function(err, doc){});
    collection.update({uid: friends_uid},{$push: {friends: uid}}, function(err, doc){});
    res.end(JSON.stringify({}));
  });
}

functions.get_new_notifications = function (req, res) {
  db.collection('messages', function(err,collection) {
    collection.find({target_uid: req.session.uid}).toArray(function(err, data){
      res.end(data.length+'');
    });
  });
}

functions.dev_save_achiv_list = function (req, res) {
  var list = req.body.list;
  db.collection('achievements', function(err,collection) {
    for(var i in list) {
      collection.update({aid: list[i].aid},{$set: {position: list[i].position}}, function(err, doc) {});
    }
    res.end(JSON.stringify({}));
  });
}

exports.routing = routing;