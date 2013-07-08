var app = init.initModels(['db', 'users']);

var ext_achivster = require('../external/achivster.js');

exports.list = function(req, res) {
  app.users.getFriendsList(req.session.uid, function(friends) {
    res.end(JSON.stringify(friends));
  });
}

exports.accept = function(req, res) {
  var target_uid = req.session.uid;
  var owner_uid = req.body.owner_uid;

  app.db.conn.collection('users_profile', function(err, profile) {
    profile.update({uid: owner_uid},{$push: {friends: target_uid}}, function(err, doc) {});
    profile.update({uid: target_uid},{$push: {friends: owner_uid}}, function(err, doc) {});
    app.db.conn.collection('messages', function(err,collection) {
      collection.remove({owner_uid: owner_uid, target_uid: target_uid}, function(err, doc){
        ext_achivster.check_first_friend(owner_uid);
        res.json({});
      });
    });
  });
}

exports.reject = function(req, res) {
  var target_uid = req.session.uid;
  var owner_uid = req.body.owner_uid;

  app.db.conn.collection('messages', function(err,collection) {
    collection.remove({owner_uid: owner_uid, target_uid: target_uid}, function(err, doc){
      res.json({});
    });
  });
}

exports.remove = function(req, res) {
  var uid = req.session.uid;
  var friend_uid = req.body.friend_uid;
  app.users.removeFriendship(uid, friend_uid, function(){
    res.json({});  
  });
}

exports.restore = function(req, res) {
  var uid = req.session.uid;
  var friend_uid = req.body.friend_uid;
  app.users.restoreFriendship(uid, friend_uid, function(){
    res.json({});
  });
}

exports.add = function(req, res) {
  var target_uid = req.body.uid;
  var owner_uid = req.session.uid;
  app.users.getName(owner_uid, function(name) {
    app.db.conn.collection('messages', function(err,collection) {
      collection.findOne({$or: [{owner_uid: owner_uid, target_uid: target_uid},{owner_uid: target_uid, target_uid: owner_uid}], type: 'friendship_request'}, function(err, doc) {
        if(doc !== null) {
          if(doc.owner_uid === target_uid) {
            res.json({message: 'Вас уже пригласили. Проверьте Ваши личные сообщения.'});
          } else {
            res.json({message: 'Приглашение уже отправлено.'});
          }
        } else {
          var data = name + ' приглашает Вас стать другом.';
          collection.insert({owner_uid: owner_uid, target_uid: target_uid, type: 'friendship_request', time: new Date().getTime(), data: data}, function(err, doc){});
          res.json({message: 'Приглашение отправлено.'});
        }
      });
    });
  });
}