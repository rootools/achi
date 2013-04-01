var app = require('../init.js').init(['db', 'async']);

exports.WorldTop = function(cb) {
  app.db.conn.collection('users_achievements', function(err, collection) {
    collection.aggregate({$unwind: "$achievements"},{$group: {_id: "$uid", achiv: {$addToSet: "$achievements.aid"}}}, function(err, doc) {
      doc.sort(function(a,b) {
        if (a.achiv.length > b.achiv.length) {return -1;}
        if (a.achiv.length < b.achiv.length) {return 1;}
        return 0;
      });
      doc.length = 10;
      var handler = doc.length;
      var world_top = [];
      
      function callback(row) {
        app.db.conn.collection('achievements', function(err, collection) {
          collection.find({aid: {$in: row.achiv}},{points: 1, _id:0}).toArray(function(err, doc) {
            var sum = 0;
            for(var i in doc) {
              sum += doc[i].points;
            }
            
            app.db.conn.collection('users_profile', function(err, users_profile) {
              users_profile.findOne({uid: row._id}, function(err, profile) {
                if(profile.name === '') { profile.name = 'anonymous';}
                world_top.push({uid: row._id, points: sum, name: profile.name, photo: profile.photo});
                handler--;
                if(handler === 0) {
                  world_top.sort(function(a,b) {
                    if (a.points > b.points) {return -1;}
                    if (a.points < b.points) {return 1;}
                    return 0;
                  });
                  cb(world_top);
                }
              });
            });
          });
        });
      }
      
      app.async.forEach(doc, callback, function(err) {});
    });
  });
}