var app = require('../init.js').initModels(['db', 'achivments', 'users']);
var mod = require('../init.js').initModules(['underscore', 'moment']);

mod.moment.lang('ru');

//get_user_stat
exports.getStat = function (uid, points, cb) {
  app.db.conn.collection('users_profile', function(err, collection) {
    collection.findOne({uid: uid},{name: 1, _id: 0, photo: 1, friends: 1}, function(err, doc) {
      doc.points = points;
      cb(doc);
    });
  });
}

exports.GetPointSum = function(uid, cb) {
  app.db.conn.collection('users_achievements', function(err, collection) {
    collection.find({uid: uid},{achievements: 1, _id: 0}).toArray(function(err, doc) {

    var aids = [];

    for(var i in doc) {
      for(var r in doc[i].achievements) {
        aids.push(doc[i].achievements[r].aid);
      }
    }

    if(aids.length === 0) {
      cb(0);
    } else {
      app.db.conn.collection('achievements', function(err, collection) {
        collection.find({aid: {$in: aids}}, {points:1, _id: 0}).toArray(function(err, doc) {
          var points = 0;
          for(var i in doc) {
            points += doc[i].points;
          }
          cb(points);
        });
      });
    }

    });
  });
}

exports.GetUsersProfiles = function(uids, cb) {
  app.db.conn.collection('users_profile', function(err, collection) {
    collection.find({uid: {$in: uids}}, {_id: 0, name: 1, photo: 1, uid: 1}).toArray(function(err, doc) {
      cb(doc);
    });
  });
}

exports.GetUsersFriendsUids = function(uid, cb) {
  app.db.conn.collection('users_profile', function(err, collection) {
    collection.findOne({uid: uid}, {_id:0, friends: 1}, function(err, doc) {
      cb(doc.friends);
    });
  });
}

exports.GetUsersNewsByUids = function(uids, cb) {
  var result = [];
  var stamp = 0;
  app.db.conn.collection('users_achievements', function(err, collection) {
    collection.aggregate({$match: {uid: {$in: uids}, achievements: {$elemMatch: {time: {$gt: stamp}}}}},{$group:{_id: "$uid", achivs: {$addToSet: "$achievements"}}}, function(err, doc) {
      for(var i in doc) {
        var arr = mod.underscore.flatten(doc[i].achivs);
        for(var n in arr) {
          arr[n].uid = doc[i]._id;
        }
        result.push(arr);
      }
      result = mod.underscore.flatten(result);
      result.sort(function(a,b){ return a.time - b.time; }).reverse();
      
      //Latest 20 row!!
      result = result.slice(0, 20);

      var aids = [];
      for(var i in result) {
        aids.push(result[i].aid);
      }
      aids = mod.underscore.uniq(aids);

      app.achivments.GetAchievementsInfoByAids(aids, function(achiv_info) {
        for(var k in result) {
          var a = mod.underscore.find(achiv_info, function(re) { return re.aid === result[k].aid });
          result[k].aname = a.name;
          result[k].description = a.description;
          result[k].icon = a.icon;
          result[k].points = a.points;
          result[k].service = a.service;
          var duration = new Date().getTime() - result[k].time;
          result[k].time = mod.moment.duration(duration, "milliseconds").humanize();
        }
        app.users.GetUsersProfiles(uids, function(users) {
          for(var z in result) {
            var u = mod.underscore.find(users, function(re) { return re.uid === result[z].uid });
            result[z].name = u.name;
            result[z].photo = u.photo;
          }
          
          cb(result);
        });

      });

    });
  });
}