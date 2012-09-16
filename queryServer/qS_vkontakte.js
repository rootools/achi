var async = require('async');

function checkVkontakteAchievements(uid, data, db, cb) {

  async.parallel({
    users: function(callback) {
             db.collection('users_achievements', function(err, collection) {
               collection.findOne({uid:uid, service:'vkontakte'}, function(err, doc) {
                 if(doc.achievements == undefined) { doc.achievements = [];}
                 callback(null, doc.achievements);
               });
             });
           },
    all: function(cb) {
           db.collection('achievements', function(err,collection) {
             collection.find({service: 'vkontakte'},{aid: 1}).toArray(function(err, docs) {
               cb(null, docs);
             });
           });
         },
    }, function(err, res) {
      res.all = createAIDarray(res.all);
      res.users = createAIDarray(res.users);
      if(res.users == undefined || res.users.length == 0) {res.users = [];}
      var notRecieved = res.all;
      for(var i=0;i<notRecieved.length;i++) {
        for(var r=0;r<res.users.length;r++) {
          if(res.users[r] == notRecieved[i]) {
            notRecieved.splice(i,1);
          }
        }
      }
      for(var i=0;i<notRecieved.length;i++) {
        var runTest = eval('vk_'+notRecieved[i]);
        runTest(uid, data, notRecieved[i], db);
      }
      cb('done');
    });

}

// Add 10 friends
function vk_0NwF1LKsXAcLNWIdmadLThRksh7k4l(uid, data, aid, db) {
  if(data.friendsCount >= 10) {
    writeToDB(uid, aid, db);
  }
}

function writeToDB(uid, aid, db) {
  db.collection('users_achievements', function(err,collection) {
    collection.update({uid:uid, service: 'vkontakte'}, {$push: {achievements:{aid:aid, time:new Date().getTime()}} }, function(err, doc) {
    });
  });
}


function createAIDarray(data) {
  var newArray = [];
  for(var i=0;i<data.length;i++) {
    newArray.push(data[i].aid);
  }
  return newArray;
}

exports.checkVkontakteAchievements = checkVkontakteAchievements;
