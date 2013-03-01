var config = require('../configs/config.js');
var locale = require('../configs/locale/main.js');
var dashboard = require('./dashboard.js');
var ext_achivster = require('../external/achivster.js');
var db;

/*var redis = require("redis"),
    red = redis.createClient();
    red.select(6);
*/
function mongoConnect() {
  var mongodb = require("mongodb"),
    mongoserver = new mongodb.Server(config.mongo.host, config.mongo.port, config.mongo.server_config),
    db_connector = new mongodb.Db(config.mongo.db, mongoserver, config.mongo.connector_config);

  db_connector.open(function(err, dbs) {
    db = dbs;
  });
}

mongoConnect();

function routing(req, res) {
  if(req.session.auth === true) {
    try {
      var runFunc = eval(req.body.action);
      runFunc(req, res);
    } catch(e) {
      console.log(e + 'Error Method');
      res.end('');
    }
  } else {
    res.end('');
  }
}

/*
// Проверь используется ли
function addService(req, res) {
  testService(req.session.uid, req.body.service, function(check) {
    if(check) {
      db.collection('services_connections', function(err,collection) {
        collection.insert({uid: req.session.uid, service:req.body.service, service_login: req.body.account, addtime:new Date().getTime(), valid: true, lastupdate:''}, function(err, doc) {
          res.end('Database Error');
        });
      });
    } else {
      res.end('Allready in DB');
    }
  });
  res.end('');
}

function testService(uid, service, cb) {
  db.collection('services_connections', function(err,collection) {
    collection.findOne({uid: uid, service:service}, function(err, doc) {
      if(err === null && doc === null) {
        cb(true);
      } else {
        cb(false);
      }
    });
  });
}
*/

function getAchievementsList(req, res) {
  db.collection('achievements', function(err,collection) {
    collection.find({service:req.body.service}).sort({position: 1}).toArray(function(err, data) {
      res.end(JSON.stringify(data));
    });
  });
}

function userAchievementsList(req, res) {
  db.collection('users_achievements', function(err,collection) {
    collection.findOne({uid:req.session.uid, service:req.body.service},{achievements:1},function(err ,data) {
      res.end(JSON.stringify(data));
    });
  });
}

function find_by_email(req, res) {
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
            dashboard.getUserAchievements(doc.uid, function(smth, last, data) {
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

function get_name_by_uid(uid, cb) {
  db.collection('users_profile', function(err,collection) {
    collection.findOne({uid:uid},{name: 1, _id: 0}, function(err, doc) {
      cb(doc.name);
    });
  });
}

function send_friendship_request(req, res) {
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

function friendship_accept_or_reject(req, res) {
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

function remove_friendship(req, res) {
  var uid = req.session.uid;
  var friends_uid = req.body.friends_uid;
  remove_friend_by_uid(uid, friends_uid);
  remove_friend_by_uid(friends_uid, uid);
  res.end(JSON.stringify({}));
}

function remove_friend_by_uid(uid, friends_uid) {
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

function restore_friendship(req, res) {
  var uid = req.session.uid;
  var friends_uid = req.body.friends_uid;
  db.collection('users_profile', function(err,collection) {
    collection.update({uid: uid},{$push: {friends: friends_uid}}, function(err, doc){});
    collection.update({uid: friends_uid},{$push: {friends: uid}}, function(err, doc){});
    res.end(JSON.stringify({}));
  });
}

function get_new_notifications(req, res) {
  db.collection('messages', function(err,collection) {
    collection.find({target_uid: req.session.uid}).toArray(function(err, data){
      res.end(data.length+'');
    });
  });
}

function dev_save_achiv_list(req, res) {
  var list = req.body.list;
  db.collection('achievements', function(err,collection) {
    for(var i in list) {
      collection.update({aid: list[i].aid},{$set: {position: list[i].position}}, function(err, doc) {});
    }
    res.end(JSON.stringify({}));
  });
}

exports.routing = routing;