var async = require('async');

function checkInstagramAchievements(uid, data, db, cb) {

  async.parallel({
    users: function(callback) {
             db.collection('users_achievements', function(err, collection) {
               collection.findOne({uid:uid, service:"instagram"}, function(err, doc) {
                 callback(null, doc.achievements);
               });
             });
           },
    all: function(cb) {
           db.collection('achievements', function(err,collection) {
             collection.find({service: 'instagram'},{aid: 1}).toArray(function(err, docs) {
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
        var runTest = eval('inst_'+notRecieved[i]);
        runTest(uid, data, notRecieved[i], db);
      }
      cb('done');
    });

}

// Add 1 Media
function inst_NHaBLwZK51sOGIO0EQWHddDCnEEAMM(uid, data, aid, db) {
  if(data.media >= 1) {
    writeToDB(uid, aid, db);
  }
}

// Add 50 Media
function inst_x7pDo1RB61PvZTMAIn0OlJUitBM61m(uid, data, aid, db) {
  if(data.media >= 50) {
    writeToDB(uid, aid, db);
  }
}

// Add 100 Media
function inst_mpHGMSuBKCJNMUJ2d23GLT1r2dY6oy(uid, data, aid, db) {
  if(data.media >= 100) {
    writeToDB(uid, aid, db);
  }
}

// Add 500 Media
function inst_hqx178WgQ9BPisD1RsnnehAJugEzMT(uid, data, aid, db) {
  if(data.media >= 500) {
    writeToDB(uid, aid, db);
  }
}

// Follow 1 people
function inst_ZgQdCo45saEu45AOKim6WVnGn5vMfU(uid, data, aid, db) {
  if(data.follows >= 1) {
    writeToDB(uid, aid, db);
  }
}

// Follow 1 people
function inst_ZgQdCo45saEu45AOKim6WVnGn5vMfU(uid, data, aid, db) {
  if(data.follows >= 1) {
    writeToDB(uid, aid, db);
  }
}

// Follow 10 people
function inst_BZMOU4DCk8NxiN6AIs2xELYJKDJvf8(uid, data, aid, db) {
  if(data.follows >= 10) {
    writeToDB(uid, aid, db);
  }
}

// Follow 50 people
function inst_c9xwE32sZLFJhpApnCBtlHlGFRkNNy(uid, data, aid, db) {
  if(data.follows >= 50) {
    writeToDB(uid, aid, db);
  }
}

// Follow 100 people
function inst_2l7cIeLzMF4jQlZgxjUWtluly5WBxH(uid, data, aid, db) {
  if(data.follows >= 100) {
    writeToDB(uid, aid, db);
  }
}

// Followed 1 people
function inst_B5NPseFzzYbbVUFk2NqWftfUiVGx6G(uid, data, aid, db) {
  if(data.followed_by >= 1) {
    writeToDB(uid, aid, db);
  }
}

// Followed 10 people
function inst_pDOmoXjoxbSBryVwcVKpVYUwdu0bgg(uid, data, aid, db) {
  if(data.followed_by >= 10) {
    writeToDB(uid, aid, db);
  }
}

// Followed 50 people
function inst_dF7m0NxU4xHnFOsnrdDkcXRzwQP8Wz(uid, data, aid, db) {
  if(data.followed_by >= 50) {
    writeToDB(uid, aid, db);
  }
}

// Followed 100 people
function inst_sKwTXo2DgXUbTi3PB89tur9CFYfuG9(uid, data, aid, db) {
  if(data.followed_by >= 100) {
    writeToDB(uid, aid, db);
  }
}

function writeToDB(uid, aid, db) {
  db.collection('users_achievements', function(err,collection) {
    collection.update({uid:uid, service: 'instagram'}, {$push: {achievements:{aid:aid, time:new Date().getTime()}} }, function(err, doc) {
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

exports.checkInstagramAchievements = checkInstagramAchievements;