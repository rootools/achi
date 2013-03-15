var async = require('async');

function checkFoursquareAchievements(uid, data, db, cb) {

  async.parallel({
    users: function(callback) {
             db.collection('users_achievements', function(err, collection) {
               collection.findOne({uid:uid, service:"foursquare"}, function(err, doc) {
                 callback(null, doc.achievements);
               });
             });
           },
    all: function(cb) {
           db.collection('achievements', function(err,collection) {
             collection.find({service: 'foursquare'},{aid: 1}).toArray(function(err, docs) {
               cb(null, docs);
             });
           });
         },
    }, function(err, res) {
      res.all = createAIDarray(res.all);
      res.users = createAIDarray(res.users);
      if(res.users == undefined || res.users.length == 0) {res.users = [];}

      var notRecieved = [];
      
      // Dump unknown achivs
      for(var i in res.all) {
        for(var n in data) {
          if(res.all[i] === '000000'+data[n].badgeId) {
            delete data[n];
          }
        }
      }
      console.log(data[n]);


      for(var i in res.all) {
        if(res.users.indexOf(res.all[i]) === -1) {
          notRecieved.push(res.all[i]);
        }
      }

      for(var i=0;i<notRecieved.length;i++) {
        var runTest = eval('frs_'+notRecieved[i]);
        runTest(uid, data, notRecieved[i], db);
      }
      cb('done');
    });

}

// 1 Checkin
function frs_0000004c4f08667a0803bbaa202ab7(uid, data, aid, db) {
  for(var n in data) {
    if(data[n].badgeId === '4c4f08667a0803bbaa202ab7') {
      writeToDB(uid, aid, db);
    }
  }
}

function writeToDB(uid, aid, db) {
  db.collection('users_achievements', function(err,collection) {
    collection.update({uid:uid, service: 'foursquare'}, {$push: {achievements:{aid:aid, time:new Date().getTime()}} }, function(err, doc) {
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

exports.checkFoursquareAchievements = checkFoursquareAchievements;