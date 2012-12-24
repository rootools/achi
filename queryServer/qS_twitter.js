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
        var runTest = eval('twit_'+notRecieved[i]);
        runTest(uid, data, notRecieved[i], db);
      }
      cb('done');
    });

}

// Write 10 tweets
function twit_0OeqcxuY778XB5fHDJPRlk2EwWzFLd(uid, data, aid, db) {
  if(data.statuses_count >= 10) {
    writeToDB(uid, aid, db);
  }
}

// Write 100 tweets
function twit_w89OmGa81LGju9cxd2ilNtce755PBb(uid, data, aid, db) {
  if(data.statuses_count >= 100) {
    writeToDB(uid, aid, db);
  }
}

// Write 1000 tweets
function twit_KPrphso661IztHM4OYqi5Zb0IBSYZ6(uid, data, aid, db) {
  if(data.statuses_count >= 1000) {
    writeToDB(uid, aid, db);
  }
}

// Write 5000 tweets
function twit_rr0vF2Bn6a5vUbzHM8rAXDPFJSn4CN(uid, data, aid, db) {
  if(data.statuses_count >= 5000) {
    writeToDB(uid, aid, db);
  }
}

// Write 10000 tweets
function twit_9uNB3eic259fYtH1fW9UjN4hZA7vRE(uid, data, aid, db) {
  if(data.statuses_count >= 10000) {
    writeToDB(uid, aid, db);
  }
}

// Earn 5 Followers
function twit_IAT0dpCbKoHDSMIL1w1I36WZDijqCT(uid, data, aid, db) {
  if(data.followers_count >= 5) {
    writeToDB(uid, aid, db);
  }
}

// Earn 50 Followers
function twit_Y1Ra9C8EzDuOmg0YcpJNh8Wx5kM4fb(uid, data, aid, db) {
  if(data.followers_count >= 50) {
    writeToDB(uid, aid, db);
  }
}

// Earn 100 Followers
function twit_fefK09G9al1in69GhGVqqeXmY19tCx(uid, data, aid, db) {
  if(data.followers_count >= 100) {
    writeToDB(uid, aid, db);
  }
}

// Add 10 Friends
function twit_uXi2CRNFJzxZShZOnveug3B9WCVeed(uid, data, aid, db) {
  if(data.friends_count >= 10) {
    writeToDB(uid, aid, db);
  }
}

// Add 50 Friends
function twit_pySzJCgThCYghDuqPJrpT9CaNFxZng(uid, data, aid, db) {
  if(data.friends_count >= 50) {
    writeToDB(uid, aid, db);
  }
}

// Add 100 Friends
function twit_DOWVEg0x4koMUZGkFDt2StIKUvkdTZ(uid, data, aid, db) {
  if(data.friends_count >= 100) {
    writeToDB(uid, aid, db);
  }
}

function twit_1B7Hkwb4qOVKnOGuHr6qJTHONwalsu(uid, data, aid, db) {
  if(data.is_achivster === true) {
    writeToDB(uid, aid, db);
  }
}

function writeToDB(uid, aid, db) {
  db.collection('users_achievements', function(err,collection) {
    collection.update({uid:uid, service: 'twitter'}, {$push: {achievements:{aid:aid, time:new Date().getTime()}} }, function(err, doc) {
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

exports.checkTwitterAchievements = checkTwitterAchievements;
