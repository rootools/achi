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

      var notRecieved = [];
      for(var i in res.all) {
        if(res.users.indexOf(res.all[i]) === -1) {
          notRecieved.push(res.all[i]);
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

// Add 50 friends
function vk_3bgyKw50Y0OKG7KJ3UPDL9NwSwNp14(uid, data, aid, db) {
  if(data.friendsCount >= 50) {
    writeToDB(uid, aid, db);
  }
}

// Add 100 friends
function vk_ExX284q5Iz7O4v94JcjaI7uDTZYdHQ(uid, data, aid, db) {
  if(data.friendsCount >= 100) {
    writeToDB(uid, aid, db);
  }
}

// Add 500 friends
function vk_xbELzMG28H5oUA7zvocKcxasDrmvIh(uid, data, aid, db) {
  if(data.friendsCount >= 500) {
    writeToDB(uid, aid, db);
  }
}

// Add Post
function vk_sVb9UmoqbV1iQJzrtgN419bsFOCEhx(uid, data, aid, db) {
  if(data.wallCount >= 1) {
    writeToDB(uid, aid, db);
  }
}

// Add 100 Post
function vk_Qqv6WCsPco3uQXBuB37ZDm6MvXN6J9(uid, data, aid, db) {
  if(data.wallCount >= 100) {
    writeToDB(uid, aid, db);
  }
}

// Add 500 Post
function vk_pDOZyeGIEY6xs8LPZoWeqAM4geKv8i(uid, data, aid, db) {
  if(data.wallCount >= 500) {
    writeToDB(uid, aid, db);
  }
}

// Add 1000 Post
function vk_cXIk4iwKdkvFNu4WpAch9m84RAjbzK(uid, data, aid, db) {
  if(data.wallCount >= 1000) {
    writeToDB(uid, aid, db);
  }
}

// Add Audio
function vk_wZLlqdxSd4FE7S6JXQsAGenVcIq8zC(uid, data, aid, db) {
  if(data.audioCount >= 1) {
    writeToDB(uid, aid, db);
  }
}

// Add 100 Audio
function vk_yiaTkZ8PrzWNGGIgOE1kksWSG1ZJve(uid, data, aid, db) {
  if(data.audioCount >= 100) {
    writeToDB(uid, aid, db);
  }
}

// Add 500 Audio
function vk_OrRp5s2IAevQsh3vNGBfvyYJKDknR1(uid, data, aid, db) {
  if(data.audioCount >= 500) {
    writeToDB(uid, aid, db);
  }
}

// Add 1000 Audio
function vk_bpizS4iRgv2FQijSM3lwxhHNJBuGZH(uid, data, aid, db) {
  if(data.audioCount >= 1000) {
    writeToDB(uid, aid, db);
  }
}

// Add Photo
function vk_kdJHH5dLZ57i0qfH3gsniLSSTEBxQ9(uid, data, aid, db) {
  if(data.photosCount >= 1) {
    writeToDB(uid, aid, db);
  }
}

// Add 100 Photo
function vk_NDFIaAgpKrGIqwO5PXdAAcntqTz8kF(uid, data, aid, db) {
  if(data.photosCount >= 100) {
    writeToDB(uid, aid, db);
  }
}

// Add 300 Photo
function vk_FUZLmAHTPXeCx956ELb6W5FJflotId(uid, data, aid, db) {
  if(data.photosCount >= 300) {
    writeToDB(uid, aid, db);
  }
}

// Add 300 Photo
function vk_FUZLmAHTPXeCx956ELb6W5FJflotId(uid, data, aid, db) {
  if(data.photosCount >= 300) {
    writeToDB(uid, aid, db);
  }
}

// Add Video
function vk_MGTNzcrH5Ufnz1PyEujwQILeY4TgUt(uid, data, aid, db) {
  if(data.videoCount >= 1) {
    writeToDB(uid, aid, db);
  }
}

// Add 50 Video
function vk_ed8EXsl4gtD0rTThhI898ffTrFBL0Z(uid, data, aid, db) {
  if(data.videoCount >= 50) {
    writeToDB(uid, aid, db);
  }
}

// Add 100 Video
function vk_h2gOKmohUKR1LgoXOodZSQ6cQmlMec(uid, data, aid, db) {
  if(data.videoCount >= 100) {
    writeToDB(uid, aid, db);
  }
}

// Earned Post Like
function vk_Ut3pRL5dgWGx5FX0ukhQeEdgUMil6e(uid, data, aid, db) {
  if(data.maxPostLike >= 1) {
    writeToDB(uid, aid, db);
  }
}

// Earned 50 Post Like
function vk_pSeJ999JzZ2SkyD8iWffE34Vv874zu(uid, data, aid, db) {
  if(data.maxPostLike >= 50) {
    writeToDB(uid, aid, db);
  }
}

// Earned 100 Post Like
function vk_IrYhDD22CneQbsvcgclRqlWmTQCLuf(uid, data, aid, db) {
  if(data.maxPostLike >= 100) {
    writeToDB(uid, aid, db);
  }
}

// Earned Photo Like
function vk_NNJ20S3CqA9vIWiJ64fx1FzLp8WmES(uid, data, aid, db) {
  if(data.maxPhotoLike >= 1) {
    writeToDB(uid, aid, db);
  }
}

// Earned 50 Photo Like
function vk_r2F2FQ7OcX8U5ElQMskZwRAwZO8rnV(uid, data, aid, db) {
  if(data.maxPhotoLike >= 50) {
    writeToDB(uid, aid, db);
  }
}

// Earned 100 Photo Like
function vk_ie7bdaVQw0MhHTY008mcVS8EJgYDem(uid, data, aid, db) {
  if(data.maxPhotoLike >= 100) {
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
