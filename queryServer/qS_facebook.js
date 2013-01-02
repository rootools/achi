var async = require('async');

function checkFacebookAchievements(uid, data, db, cb) {
  async.parallel({
    users: function(callback) {
             db.collection('users_achievements', function(err, collection) {
               collection.findOne({uid:uid, service:'facebook'}, function(err, doc) {
                 if(doc.achievements === undefined) { doc.achievements = [];}
                 callback(null, doc.achievements);
               });
             });
           },
    all: function(cb) {
           db.collection('achievements', function(err,collection) {
             collection.find({service: 'facebook'},{aid: 1}).toArray(function(err, docs) {
               cb(null, docs);
             });
           });
         },
    }, function(err, res) {
      res.all = createAIDarray(res.all);
      res.users = createAIDarray(res.users);
      if(res.users === undefined || res.users.length === 0) {res.users = [];}

      var notRecieved = [];
      for(var i in res.all) {
        if(res.users.indexOf(res.all[i]) === -1) {
          notRecieved.push(res.all[i]);
        }
      }

      for(var i=0;i<notRecieved.length;i++) {
        var runTest = eval('fb_'+notRecieved[i]);
        runTest(uid, data, notRecieved[i], db);
      }
      cb('done');
    });

}

// Add 10 friends
function fb_4i3ipPZEq88i0bj9ZMiO4I8CGhBHsj(uid, data, aid, db) {
  if(data.friend_count >= 10) {
    writeToDB(uid, aid, db);
  }
}

// Add 50 friends
function fb_JY88jctEQ9Ze1qk2RG7lPPFXpNdVYT(uid, data, aid, db) {
  if(data.friend_count >= 50) {
    writeToDB(uid, aid, db);
  }
}

// Add 100 friends
function fb_T1jQDwGManXranbpmOep922uG7sYir(uid, data, aid, db) {
  if(data.friend_count >= 100) {
    writeToDB(uid, aid, db);
  }
}

// Add Photo
function fb_0pzom5BuhFOP3G6LwPm0oythCYGv8T(uid, data, aid, db) {
  if(data.photo_count >= 1) {
    writeToDB(uid, aid, db);
  }
}

// Add 100 Photo
function fb_gBAyOvu7Yzq9lvQuviF3bWFBRMnGVO(uid, data, aid, db) {
  if(data.photo_count >= 100) {
    writeToDB(uid, aid, db);
  }
}

// Add 300 Photo
function fb_mKOk0k81RVEOf5UcH9pFX8OAzwz77S(uid, data, aid, db) {
  if(data.photo_count >= 300) {
    writeToDB(uid, aid, db);
  }
}

// Add 5 Likes
function fb_lM92fNOvGl1ZwhSoJenSQAi6ObkRN7(uid, data, aid, db) {
  if(data.likes_count >= 5) {
    writeToDB(uid, aid, db);
  }
}

// Add 30 Likes
function fb_RX7VbPD4WxPLsVx5nGicjt70Avvi6r(uid, data, aid, db) {
  if(data.likes_count >= 30) {
    writeToDB(uid, aid, db);
  }
}

// Add 50 Likes
function fb_DpJUQvJYEaL0jmqSzGwaQBohSeTgyk(uid, data, aid, db) {
  if(data.likes_count >= 50) {
    writeToDB(uid, aid, db);
  }
}

function fb_QTBBJJfqWeSWI7W6TcNgKQOAs4BeGj(uid, data, aid, db) {
  if(data.is_achivster === true) {
    writeToDB(uid, aid, db);
  }
}

function writeToDB(uid, aid, db) {
  db.collection('users_achievements', function(err,collection) {
    collection.update({uid:uid, service: 'facebook'}, {$push: {achievements:{aid:aid, time:new Date().getTime()}} }, function(err, doc) {
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

exports.checkFacebookAchievements = checkFacebookAchievements;
