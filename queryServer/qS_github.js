var async = require('async');

function checkGithubAchievements(uid, data, db, cb) {

  async.parallel({
    users: function(callback) {
             db.collection('users_achievements', function(err, collection) {
               collection.findOne({uid:uid, service: 'github'}, function(err, doc) {
                 callback(null, doc.achievements);
               });
             });
           },
    all: function(cb) {
           db.collection('achievements', function(err,collection) {
             collection.find({service: 'github'},{aid: 1}).toArray(function(err, docs) {
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
        var runTest = eval('github_'+notRecieved[i]);
        runTest(uid, data, notRecieved[i], db);
      }
      cb('done');
    });

}

// Add 1 repo
function github_Bb0xWaW1sTGO2aaGCjP0GkVue66cOJ(uid, data, aid, db) {
  if(data.repo_count >= 1) {
    writeToDB(uid, aid, db);
  }
}

// Add 5 repo
function github_XkP1262wBefye6AG4aNnJ04Ns9Drif(uid, data, aid, db) {
  if(data.repo_count >= 5) {
    writeToDB(uid, aid, db);
  }
}

// Add 10 repo
function github_0s4i0xA0C3MVnqqa4TG9Pgfm7D9GYX(uid, data, aid, db) {
  if(data.repo_count >= 10) {
    writeToDB(uid, aid, db);
  }
}

// Add 30 repo
function github_DOMXlqpQg1q3HbVgeC9Hc0Bpz5nxVM(uid, data, aid, db) {
  if(data.repo_count >= 30) {
    writeToDB(uid, aid, db);
  }
}

// Add 50 repo
function github_PmollXjNoOzEp0F9JZOVoTKiOsCxQW(uid, data, aid, db) {
  if(data.repo_count >= 50) {
    writeToDB(uid, aid, db);
  }
}

// have wiki
function github_UQ3sqcJYB5FNWF5lM1MrPyNgHJnH6a(uid, data, aid, db) {
  if(data.have_wiki === true) {
    writeToDB(uid, aid, db);
  }
}

// have issues
function github_W76fUOKzhKQXSvCkodHS44K8I8Tw8f(uid, data, aid, db) {
  if(data.have_issues === true) {
    writeToDB(uid, aid, db);
  }
}

// Add 5 gists 
function github_RroLe1AKYMkpduI7axRdM7mTxVROlI(uid, data, aid, db) {
  if(data.gists >= 5) {
    writeToDB(uid, aid, db);
  }
}

// Add 10 gists 
function github_jKz0vUQ8RORWdvPG9NHknG2IKD3n8S(uid, data, aid, db) {
  if(data.gists >= 10) {
    writeToDB(uid, aid, db);
  }
}

function writeToDB(uid, aid, db) {
  db.collection('users_achievements', function(err,collection) {
    collection.update({uid:uid, service: 'github'}, {$push: {achievements:{aid:aid, time:new Date().getTime()}} }, function(err, doc) {
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

exports.checkGithubAchievements = checkGithubAchievements;
