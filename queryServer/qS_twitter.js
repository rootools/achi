var async = require('async');

function checkTwitterAchievements(uid, data, db, cb) {

  async.parallel({
    users: function(callback) {
             db.collection('users_achievements', function(err, collection) {
               collection.findOne({uid:uid, service:"twitter"}, function(err, doc) {
                 callback(null, doc.achievements);
               });
             });
           },
    all: function(cb) {
           db.collection('achievements', function(err,collection) {
             collection.find({service: 'twitter'},{aid: 1}).toArray(function(err, docs) {
               cb(null, docs);
             });
           });
         },
    }, function(err, res) {
      res.all = createAIDarray(res.all);
      console.log(res);
    });

  cb();
}


function createAIDarray(data) {
  var newArray = [];
  for(var i=0;i<data.length;i++) {
    newArray.push(data[i].aid);
  }
  return newArray;
}

exports.checkTwitterAchievements = checkTwitterAchievements;
