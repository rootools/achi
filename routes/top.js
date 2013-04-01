var app = require('../init.js').init(['db', 'async', 'top']);

var dashboard = require('./dashboard.js');

function pointsSum(uid, cb) {
  dashboard.getUserAchievements(uid, function(doc, last, data) {
    var sum = 0;
    for(var i in data) {
      sum += data[i];
    }
    cb(sum);
  });
}

function get_friends_list(uid, cb) {
  var friends_list = [];
  app.db.conn.collection('users_profile', function(err, collection) {
    collection.findOne({uid: uid},{friends: 1, _id: 0}, function(err, doc) {
      
      var friends_uid_list = doc.friends;
      friends_uid_list.push(uid);
      var handler = friends_uid_list.length;
      if(handler === 0) {
        cb([]);
      }

      function callback(uid) {
        collection.findOne({uid: uid},{_id: 0, friends: 0}, function(err, profile) {
          pointsSum(uid, function(points) {
            profile.points = points;
            if(profile.name === '') { profile.name = 'anonymous';}
            friends_list.push(profile);
            handler--;
            if(handler === 0) {
              friends_list.sort(function(a,b) {
                if (a.points > b.points) {return -1;}
                if (a.points < b.points) {return 1;}
                return 0;
              });
              cb(friends_list);
            }
          });
        });
      }
      
      app.async.forEach(friends_uid_list, callback, function(err) {});
    });
  });
}


exports.main = function(req, res) {
  app.top.WorldTop(function(world_list) {
    get_friends_list(req.session.uid, function(friends_list) {
      res.render('top.ect', { title: 'Топ', session:req.session, friends_list: friends_list, world_list: world_list});
    });
  });
};