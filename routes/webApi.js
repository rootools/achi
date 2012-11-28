var dashboard = require('./dashboard.js');
var db;

var redis = require("redis"),
    red = redis.createClient();
    red.select(6);

function mongoConnect() {
  var mongodb = require("mongodb"),
    mongoserver = new mongodb.Server('127.0.0.1', 27017, {auto_reconnect: true, safe: false, strict: false}),
    db_connector = new mongodb.Db('achi', mongoserver, '');

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

function addService(req, res) {
  testService(req.session.uid, req.body.service, function(check) {
    if(check) {
      db.collection('services_connections', function(err,collection) {
        collection.insert({uid: req.session.uid, service:req.body.service, service_login: req.body.account, addtime:new Date().getTime(), valid: true, lastupdate:''}, function(err, doc) {
          errorist(res, 'Database Error', 'OK');
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


function errorist(res, errS, normalS) {
  if(err !== null) {
    res.end(errS);
  } else {
    res.end(normalS);
  }
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
          profile.findOne({uid: doc.uid},{_id: 0, name: 1, photo: 1}, function(err, profile) {
            dashboard.getUserAchievements(doc.uid, function(smth, last, data) {
              var sum = 0;
              for(var i in data) {
                sum += data[i];
              }
              doc.points = sum;
              doc.last = last[0].name;
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

function edit_profile_name(req, res) {
  var name = req.body.name;
  var uid = req.session.uid;
  console.log(name, uid);
  db.collection('users_profile', function(err,collection) {
    collection.findOne({uid:uid}, function(err, doc) {
      if(doc === null) {
        collection.insert({uid:uid, name: name, photo: '/images/label.png'}, function(err, doc) {});
        res.end(JSON.stringify({}));
      } else {
        collection.update({uid:uid},{$set: {name: name}}, function(err, doc) {});
        res.end(JSON.stringify({}));
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
  var key = '';
  var value = '';
  check_friendship_requests(target_uid, owner_uid, function(check) {
    if(check === true) {
      get_name_by_uid(owner_uid, function(name) {
        key = target_uid + '|' + owner_uid + '|friendship_request';
        value = 'You are invited to be a friend with '+ name +'('+req.session.email+')';
        red.set(key, value);
        red.expire(key, 604800);
        db.collection('messages', function(err,collection) {
          collection.insert({owner_uid: owner_uid, target_uid: target_uid, type: 'friendship_request', data: value, time: new Date().getTime()}, function(err, doc) {
          });
        });
      });
    } else {
      res.end(JSON.stringify(check));
    }
  });
}

function check_friendship_requests(target_uid, owner_uid, cb) {
  red.get(target_uid + '|' + owner_uid + '|friendship_request', function(err, check1) {
    red.get(owner_uid + '|' + target_uid + '|friendship_request', function(err, check2) {
      if(check1 === null && check2 === null) {
        cb(true);
      } else if(check1 !== null) {
        cb({error: 'Allready'});
      } else if(check2 !== null) {
        cb({error: 'Your invited'});
      }
    });
  });
}

function get_new_notifications(req, res) {
  var uid = req.session.uid;
  red.keys(uid + '|*', function(err, keys) {
    if(keys) {
      res.end(JSON.stringify({notice: keys.length}));
    } else {
      res.end(JSON.stringify({}));
    }
  });
}

function edit_profile_change_password(req, res) {
  var oldPass = req.body.oldPass;
  var newPass = req.body.newPass;
  db.collection('users', function(err,collection) {
    collection.findOne({uid:req.session.uid}, function(err, doc) {
      if(doc.password === oldPass) {
        collection.update({uid:req.session.uid},{$set: {password: newPass}}, function(err, doc){});
        res.end(JSON.stringify({}));
      } else {
        res.end(JSON.stringify({error: 'Incorrect Old password' }));
      }
    });
  });
}

exports.routing = routing;