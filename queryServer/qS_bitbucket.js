var async = require('async');

function checkBitbucketAchievements(uid, data, db, cb) {

  async.parallel({
    users: function(callback) {
             db.collection('users_achievements', function(err, collection) {
               collection.findOne({uid:uid, service:"bitbucket"}, function(err, doc) {
                 callback(null, doc.achievements);
               });
             });
           },
    all: function(cb) {
           db.collection('achievements', function(err,collection) {
             collection.find({service: 'bitbucket'},{aid: 1}).toArray(function(err, docs) {
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
        var runTest = eval('bb_'+notRecieved[i]);
        runTest(uid, data, notRecieved[i], db);
      }
      cb('done');
    });

}

// Add 1 repo
function bb_feUPePCCAEz5Jfq1jmMLxDeKJXm7aY(uid, data, aid, db) {
  if(data.repo_count >= 1) {
    writeToDB(uid, aid, db);
  }
}

// Add 5 repo
function bb_qWBEuYRGSDOjzIe6OLrHNDLonmqWhk(uid, data, aid, db) {
  if(data.repo_count >= 5) {
    writeToDB(uid, aid, db);
  }
}

// Add 10 repo
function bb_TS589gtvOJo80eyInViBdQ1mAFQlik(uid, data, aid, db) {
  if(data.repo_count >= 10) {
    writeToDB(uid, aid, db);
  }
}

// Add 30 repo
function bb_ssewrd1sblSssoqyzDeDtMNYymwUPz(uid, data, aid, db) {
  if(data.repo_count >= 30) {
    writeToDB(uid, aid, db);
  }
}

// Use wiki
function bb_XFxmtfB80a1NHCKtcTQ4hgYuP8V2e4(uid, data, aid, db) {
  if(data.have_wiki === true) {
    writeToDB(uid, aid, db);
  }
}

// Use issues
function bb_rJvkcmWfOhEgU92beNHXwxiB56NE0u(uid, data, aid, db) {
  if(data.have_issues === true) {
    writeToDB(uid, aid, db);
  }
}

// Use 3 lang
function bb_XfbaqTpsF9ULbdGnikknRYrTMbkzwS(uid, data, aid, db) {
  if(data.lang_list.length >= 3) {
    writeToDB(uid, aid, db);
  }
}

// Use 5 lang
function bb_wLPMP9z6zCG4mBbeONO4gyBoqtVYjw(uid, data, aid, db) {
  if(data.lang_list.length >= 5) {
    writeToDB(uid, aid, db);
  }
}

function writeToDB(uid, aid, db) {
  db.collection('users_achievements', function(err,collection) {
    collection.update({uid:uid, service: 'bitbucket'}, {$push: {achievements:{aid:aid, time:new Date().getTime()}} }, function(err, doc) {
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

exports.checkBitbucketAchievements = checkBitbucketAchievements;
