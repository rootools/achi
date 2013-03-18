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
      dump_unknown(res.all, data);

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

// 10 Checkin
function frs_0000004c4f08667a0803bbab202ab7(uid, data, aid, db) {
  for(var n in data) {
    if(data[n].badgeId === '4c4f08667a0803bbab202ab7') {
      writeToDB(uid, aid, db);
    }
  }
}

// 25 Checkin 'Expolorer'
function frs_0000004c4f08667a0803bbac202ab7(uid, data, aid, db) {
  for(var n in data) {
    if(data[n].badgeId === '4c4f08667a0803bbac202ab7') {
      writeToDB(uid, aid, db);
    }
  }
}

// 50 Checkin 'Superstar'
function frs_0000004c4f08667a0803bbad202ab7(uid, data, aid, db) {
  for(var n in data) {
    if(data[n].badgeId === '4c4f08667a0803bbad202ab7') {
      writeToDB(uid, aid, db);
    }
  }
}

// 'Local'
function frs_0000004c4f08667a0803bbb0202ab7(uid, data, aid, db) {
  for(var n in data) {
    if(data[n].badgeId === '4c4f08667a0803bbb0202ab7') {
      writeToDB(uid, aid, db);
    }
  }
}

// 'Super User'
function frs_0000004c4f08667a0803bbb1202ab7(uid, data, aid, db) {
  for(var n in data) {
    if(data[n].badgeId === '4c4f08667a0803bbb1202ab7') {
      writeToDB(uid, aid, db);
    }
  }
}

// '9 to 5'
function frs_0000004caa535f30bd9eb05be32923(uid, data, aid, db) {
  for(var n in data) {
    if(data[n].badgeId === '4caa535f30bd9eb05be32923') {
      writeToDB(uid, aid, db);
    }
  }
}

// 'Back to School'
function frs_000000503552d6011c38107f4f08ec(uid, data, aid, db) {
  for(var n in data) {
    if(data[n].badgeId === '503552d6011c38107f4f08ec') {
      writeToDB(uid, aid, db);
    }
  }
}

// 'Mall Rat'
function frs_0000004ecbdd9e7beb20ebed8da36d(uid, data, aid, db) {
  for(var n in data) {
    if(data[n].badgeId === '4ecbdd9e7beb20ebed8da36d') {
      writeToDB(uid, aid, db);
    }
  }
}

// 'Trainspotter'
function frs_0000004f6a48fa7beb7e5831d4eb25(uid, data, aid, db) {
  for(var n in data) {
    if(data[n].badgeId === '4f6a48fa7beb7e5831d4eb25') {
      writeToDB(uid, aid, db);
    }
  }
}

// 'Super Mayor'
function frs_0000004c4f08667a0803bbe4202ab7(uid, data, aid, db) {
  for(var n in data) {
    if(data[n].badgeId === '4c4f08667a0803bbe4202ab7') {
      writeToDB(uid, aid, db);
    }
  }
}

// 'Hats Off'
function frs_0000004f8d9b9b7beb82ec71aa9ef6(uid, data, aid, db) {
  for(var n in data) {
    if(data[n].badgeId === '4f8d9b9b7beb82ec71aa9ef6') {
      writeToDB(uid, aid, db);
    }
  }
}

// 'Overshare'
function frs_0000004c4f08667a0803bbc3202ab7(uid, data, aid, db) {
  for(var n in data) {
    if(data[n].badgeId === '4c4f08667a0803bbc3202ab7') {
      writeToDB(uid, aid, db);
    }
  }
}

// 'Swimmies'
function frs_0000004c7d1dd0978976b0c7cee939(uid, data, aid, db) {
  for(var n in data) {
    if(data[n].badgeId === '4c7d1dd0978976b0c7cee939') {
      writeToDB(uid, aid, db);
    }
  }
}

// 'Pizzaiolo'
function frs_0000004c4f08667a0803bbdd202ab7(uid, data, aid, db) {
  for(var n in data) {
    if(data[n].badgeId === '4c4f08667a0803bbdd202ab7') {
      writeToDB(uid, aid, db);
    }
  }
}

// 'Great Outdoors'
function frs_0000004c7d1deb978976b064cfe939(uid, data, aid, db) {
  for(var n in data) {
    if(data[n].badgeId === '4c7d1deb978976b064cfe939') {
      writeToDB(uid, aid, db);
    }
  } 
}

// 'JetSetter'
function frs_0000004c4f08667a0803bbda202ab7(uid, data, aid, db) {
  for(var n in data) {
    if(data[n].badgeId === '4c4f08667a0803bbda202ab7') {
      writeToDB(uid, aid, db);
    }
  }
}

// 'Zoetrope'
function frs_0000004c4f08667a0803bbdc202ab7(uid, data, aid, db) {
  for(var n in data) {
    if(data[n].badgeId === '4c4f08667a0803bbdc202ab7') {
      writeToDB(uid, aid, db);
    }
  }
}

// 'Fresh Brew'
function frs_0000004d24bfee668f60fc7b32b26f(uid, data, aid, db) {
  for(var n in data) {
    if(data[n].badgeId === '4d24bfee668f60fc7b32b26f') {
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

function dump_unknown(all, list) {
  var dump = []
  // Ban badges
  all.push('000000510ad6a2011c1712eb17a700');
  for(var n in list) {
    if(all.indexOf('000000'+list[n].badgeId) === -1) {
      dump.push(list[n]);
    }
  }
  console.log(dump);
}

exports.checkFoursquareAchievements = checkFoursquareAchievements;
