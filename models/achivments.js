var init = require('../init.js');
var app = init.initModels(['db', 'users']);
var mod = init.initModules(['moment', 'underscore']);

// FIXME:
function get_service_icon(cb) {
  app.db.conn.collection('services_info', function(err, collection){
    collection.find({},{service:1, icon:1, _id: 0}).toArray(function(err, doc){
      cb(doc);
    });
  });
}
// /FIXME

//getUserAchievements
exports.getAll = function (uid, cb) {
  app.db.conn.collection('users_achievements', function(err, collection) {
    collection.find({uid:uid},{achievements:1, service:1}).toArray(function(err, doc) {
      exports.getLatest(doc, function(last) {
        app.users.GetPointSum(uid, function(points) {
          cb(doc, last, points);
        });
      });
    });
  });
};

//getLatestAchievements
exports.getLatest = function (uid, cb) {
  app.db.conn.collection('users_achievements', function(err, collection) {
    collection.aggregate({$match: {uid: uid}},{$unwind: "$achievements"},{$group:{_id: "$uid", achivs: {$addToSet: "$achievements"}}}, function(err, doc) {
      if(doc.length === 0) {
        cb([]);
      } else {
        
        var lastAchivArray = doc[0].achivs;
        lastAchivArray.sort(function(a,b){ return a.time - b.time; }).reverse();
        
        var lastAchivArray = lastAchivArray.slice(0, 6);
      
        var aids = [];
        for(var i in lastAchivArray) {
          aids.push(lastAchivArray[i].aid);
        }

          app.db.conn.collection('achievements', function(err, collection) {
          collection.find({aid: {$in: aids}},{_id: 0, description: 0, position: 0}).toArray(function(err, doc){

            for(var n in lastAchivArray) {
              var tmp_data = mod.underscore.find(doc, function(re) { return re.aid === lastAchivArray[n].aid });
              lastAchivArray[n].name = tmp_data.name;
              lastAchivArray[n].icon = tmp_data.icon;
              lastAchivArray[n].points = tmp_data.points;
              lastAchivArray[n].service = tmp_data.service;
              lastAchivArray[n].time = mod.moment(lastAchivArray[n].time).format('DD.MM.YYYY');
            }

            cb(lastAchivArray);
          });
        });
      }
    });
  });
};

//get_achievment_stat
// private
// non used
exports.getStat = function (achivList, allAchievements, points, cb) {
  get_service_icon(function(service_icon){
    var achivStat = [];
    for(var i=0;i<achivList.length;i++){
      var tmpObj = {};
      tmpObj.service = achivList[i].service;
      tmpObj.earned = achivList[i].achievements.length;
      tmpObj.full = allAchievements[achivList[i].service+'_count'];
      tmpObj.earnedPoints = points[achivList[i].service];
      if(tmpObj.earnedPoints === undefined) {tmpObj.earnedPoints = 0;}
      tmpObj.fullPoints = allAchievements[achivList[i].service+'_points'];
      for(var r in service_icon) {
        if(service_icon[r].service === tmpObj.service) {
          tmpObj.icon = service_icon[r].icon;
        }
      }
      achivStat.push(tmpObj);
    }
    
    for(var j in achivStat) {
      if(achivStat[j].service === 'rare' && achivStat[j].earned === 0) {
        achivStat.splice(j,1);
      } else if(achivStat[j].service === 'rare') {
        var rare = achivStat.splice(j,1);
        achivStat.push(rare[0]);
        break;
      }
    }
    
    cb(achivStat);
  });
};

//countAchivmentsFromService
exports.getCountFromService = function (data) {
  var result = {};
  result.all = data.length;
  result.earned = 0;
  result.pointsAll = 0;
  result.points = 0;
  for(var i in data) {
    if(data[i].earned === true) {
      result.earned += 1;
      result.points += data[i].points;
    }
    result.pointsAll += data[i].points;
  }
  return result;
};

//getUserAchievementsByService
exports.getByService = function (service, uid, cb) {
  app.db.conn.collection('users_achievements', function(err, collection) {
    collection.findOne({uid:uid, service:service},{achievements:1}, function(err, udoc) {
      app.db.conn.collection('achievements', function(err, collection) {
        collection.find({service:service},{sort: 'position'}).toArray(function(err, doc) {
          var response = exports.markedEarned(udoc.achievements, doc);
          // Hide rare non-earned achivs
          if(service === 'rare') {
            var newresp = [];
            for(var i in response) {
              if(response[i].earned === true) {
                newresp.push(response[i]);
              }
            }
            cb(newresp);
          } else {
            cb(response);
          }
        });
      });
    });
  });
};

//markedEarnedAchievements
// private
exports.markedEarned = function (uAch, fAch) {
  var response = fAch;
  for(var i in fAch) {
    for(var r in uAch) {
      if(uAch[r].aid == fAch[i].aid) {
        response[i].earned = true;
        response[i].time = mod.moment(uAch[r].time).format('DD.MM.YYYY');
      }
    }
    if(!response[i].earned) {
      response[i].earned = false;
      response[i].time = '';
    }
  }
  return response;
};

exports.GetAchievementsInfoByAids = function(aids, cb) {
  app.db.conn.collection('achievements', function(err, collection) {
    collection.find({aid: {$in: aids}}, {_id: 0, position: 0}).toArray(function(err, doc) {
      cb(doc);
    });
  });
}