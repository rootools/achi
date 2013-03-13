var config = require('../configs/config.js');
var moment = require('moment');
var async = require('async');
var underscore = require('underscore');

var db;

function mongoConnect() {
  var mongodb = require("mongodb"),
    mongoserver = new mongodb.Server(config.mongo.host, config.mongo.port, config.mongo.server_config),
    db_connector = new mongodb.Db(config.mongo.db, mongoserver, config.mongo.connector_config);

  db_connector.open(function(err, dbs) {
    db = dbs;
  });
}

mongoConnect();

// HASH IT!!
function getUserAchievements(uid, cb) {
  db.collection('users_achievements', function(err, collection) {
    collection.find({uid:uid},{achievements:1, service:1}).toArray(function(err, doc) {
      getLatestAchievements(doc, function(last) {
        getUserAchievementsPoints(doc, function(points) {
          cb(doc, last, points);
        });
      });
    });
  });
}

function getUserAchievementsPoints(data, cb) {

	var pointsList = [];
	var aids = [];

	for(var i in data) {
		for(var r in data[i].achievements) {
			aids.push(data[i].achievements[r].aid);
		}
	}

  if(aids.length === 0) {
    cb([]);
  }

  db.collection('achievements', function(err, collection) {
    collection.find({aid: {$in: aids}},{service: 1, points:1, _id:0}).toArray(function(err, doc) {
      var response = {};
      for(var i in doc) {
        if(response[doc[i].service] !== undefined) {
          response[doc[i].service] += doc[i].points;
        } else {
          response[doc[i].service] = doc[i].points;             
        }
      }
      cb(response);
    });
  });
}


// HASH IT!!
function getAllAchievementsCount(cb) {
	var result = {};
	db.collection('achievements', function(err, collection) {
		collection.find({},{service: 1, points:1}).toArray(function(err, doc) {
			for(var i=0;i<doc.length;i++){
        if(result[doc[i].service+'_count'] !== undefined) {
					result[doc[i].service+'_count'] += 1;
					result[doc[i].service+'_points'] += doc[i].points;
				} else {
					result[doc[i].service+'_count'] = 1;
					result[doc[i].service+'_points'] = doc[i].points;
				}
      }
      cb(result);
		});
	});
}

// HASH IT!!
// return 'name', 'icon', 'service', 'time' and 'points' of last 6 achievenments
function getLatestAchievements(uid, cb) {
  db.collection('users_achievements', function(err, collection) {
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

	      db.collection('achievements', function(err, collection) {
          collection.find({aid: {$in: aids}},{_id: 0, description: 0, position: 0}).toArray(function(err, doc){

            for(var n in lastAchivArray) {
              var tmp_data = underscore.find(doc, function(re) { return re.aid === lastAchivArray[n].aid });
              lastAchivArray[n].name = tmp_data.name;
              lastAchivArray[n].icon = tmp_data.icon;
              lastAchivArray[n].points = tmp_data.points;
              lastAchivArray[n].service = tmp_data.service;
              lastAchivArray[n].time = moment(lastAchivArray[n].time).format('DD.MM.YYYY');
            }

            cb(lastAchivArray);
          });
        });
      }
    });
  });
}


function get_achievment_stat(achivList, allAchievements, points, cb) {
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
}

function get_service_icon(cb) {
  db.collection('services_info', function(err, collection){
    collection.find({},{service:1, icon:1, _id: 0}).toArray(function(err, doc){
      cb(doc);
    });
  });
}

function countAchivmentsFromService(data) {
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
}

function get_user_stat(uid, points, cb) {
  db.collection('users_profile', function(err, collection) {
    collection.findOne({uid: uid},{name: 1, _id: 0, photo: 1, friends: 1}, function(err, doc) {
      doc.points = points;
      cb(doc);
    });
  });
}

// HASH IT!!
function getUserAchievementsByService(service, uid, cb) {
  db.collection('users_achievements', function(err, collection) {
    collection.findOne({uid:uid, service:service},{achievements:1}, function(err, udoc) {
      db.collection('achievements', function(err, collection) {
        collection.find({service:service},{sort: 'position'}).toArray(function(err, doc) {
          var response = markedEarnedAchievements(udoc.achievements, doc);
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
}

function markedEarnedAchievements(uAch, fAch) {
	var response = fAch;
	for(var i in fAch) {
		for(var r in uAch) {
			if(uAch[r].aid == fAch[i].aid) {
				response[i].earned = true;
				response[i].time = moment(uAch[r].time).format('DD.MM.YYYY');
			}
		}
		if(!response[i].earned) {
			response[i].earned = false;
			response[i].time = '';
		}
	}
	return response;
}

function getServiceInfo(service, cb) {
  db.collection('services_info', function(err, collection) {
    collection.findOne({service:service}, function(err, doc) {  
      cb(doc);
    });
  });
}

exports.service = function(req, res) {
  if(req.session.auth === false) {
    res.redirect(config.site.url);
  } else {
    getUserAchievementsByService(req.params.service, req.session.uid, function(data){
      var service_info_count = countAchivmentsFromService(data);
      getServiceInfo(req.params.service, function(serviceInfo) {
        res.render('dashboard_service.ect', { title: 'Сводка', list:data, service_info:serviceInfo, service_info_count: service_info_count,session: req.session});
      });
    });
  }
};

exports.service_user = function(req, res) {
  getUserAchievementsByService(req.params.service, req.params.id, function(data){
    getServiceInfo(req.params.service, function(serviceInfo) {
      var service_info_count = countAchivmentsFromService(data);
      res.render('dashboard_service.ect', { title: 'Сводка', list:data, service_info:serviceInfo, service_info_count: service_info_count,session: req.session});
    });
  });
};

function GetServiceList(uid, cb) {
  async.parallel({
    
    info: function(callback) {
      db.collection('services_info', function(err, collection) {
        collection.find({type: 'internal'},{_id:0}).toArray(function(err, services_info) {
          callback(null, services_info);
        });
      });
    },
    
    connections: function(callback) {
      db.collection('services_connections', function(err, collection) {
        collection.find({uid: uid},{valid: 1, service: 1, _id:0}).toArray(function(err, services_connections) {
          callback(null, services_connections);
        });
      });
    },
    
    users_achievements: function(callback) {
      db.collection('users_achievements', function(err, collection) {
        collection.find({uid: uid},{service: 1, achievements: 1, _id:0}).toArray(function(err, data) {
          var handler = data.length;
          var users_achievements = [];

          var q = async.queue(function(task) {
            var aids = [];
            for(var h in task.achievements) {
              aids.push(task.achievements[h].aid);
            }
            
            db.collection('achievements', function(err, collection) {
              collection.find({aid: {$in: aids}},{points: 1, _id:0}).toArray(function(err, doc) {
                
                var sum = 0;
                for(var s in doc) {
                  sum += doc[s].points;
                }
                task.points = sum;
                users_achievements.push(task);
                handler--;
                if(handler === 0) {
                  callback(null, users_achievements);
                }
                
              });
            });
          }, data.length);

          for(var g in data) {
            q.push(data[g], function(err) {});
          }
        });
      });
    },
    achievements: function(callback) {
      db.collection('achievements', function(err, collection) {
        collection.aggregate({$group: {_id: "$service", points: {$sum: "$points"}, count: {$sum: 1}}}, function(err, doc) {
          callback(null, doc);
        });
      });
    },
    external: function(callback) {
      db.collection('services_connections', function(err, collection) {
        collection.find({uid: uid, type: 'external'},{_id:0, app_id: 1}).toArray(function(err, services_connections) {
          var app_ids = [];
          for(var i in services_connections) {
            app_ids.push(services_connections[i].app_id);
          }
          db.collection('services_info', function(err, collection) {
            collection.find({app_id: {$in: app_ids}},{_id: 0}).toArray(function(err, doc) {
              callback(null, doc);    
            });
          });
          
        });
      });
    }
  }, function(err, result) {
    var data = result.info;
    
    // Add external services
    for(var n in result.external) {
      data.push(result.external[n]);
    }

    for(var i in data) {
      data[i].valid = false;
      data[i].earnedPoints = 0;
      data[i].earned = 0;
      for(var u in result.users_achievements) {
        if(data[i].service === result.users_achievements[u].service) {
          data[i].earned = result.users_achievements[u].achievements.length;
          data[i].earnedPoints = result.users_achievements[u].points;
        }
      }
      for(var c in result.connections) {
        if(data[i].service === result.connections[c].service) {
          data[i].valid = result.connections[c].valid;
        }
      }
      for(var a in result.achievements) {
        if(data[i].service === result.achievements[a]._id) {
          data[i].fullPoints = result.achievements[a].points;
          data[i].full = result.achievements[a].count;
        }
      }
      
      if(data[i].valid === true) {
        data[i].url = '/dashboard/'+data[i].service;
      } else {
        data[i].url = '/add_service/'+data[i].service;
      }
    }

    data.sort(function(a, b) {
      if(a.valid) { return -1;}
      if(!a.valid) { return 1;}
    });

    for(var i in data) {
      if(data[i].service === 'rare' && data[i].earned === 0) {
        data.splice(i, 1);
      } else if(data[i].service === 'rare') {
        var rare = data.splice(i,1);
        data.push(rare[0]);
        break;
      }
    }
    cb(data);
  });
}

function FixToTargetUid(uid, data) {
  for(var i in data) {
    if(data[i].url.split('/')[1] === 'dashboard') {
      data[i].url += '/user/'+uid;  
    } else {
      data[i].url = '/dashboard/user/'+uid;
    }
  }
  return data;
}

function CheckFriendships(uid, friends) {
  var flag = true;
  for(var i in friends) {
    if(friends[i] === uid) {
      flag = false;
      return flag;
    }
  }
  return flag;
}

exports.main = function(req, res) {
  if(req.session.auth === false) {
    res.redirect(config.site.url);
  } else {
    var uid = req.session.uid;
    GetServiceList(uid, function(achivList) {
      var sum = 0;
      for(var i in achivList) {
        sum += achivList[i].earnedPoints;
      }
      get_user_stat(uid, sum, function(user_stat) {
        getLatestAchievements(uid, function(last) {
          res.render('dashboard.ect', { title: 'Сводка', session: req.session, user_stat: user_stat, achievements: achivList, lastAchivArray: last});
        });
      });  
    });
  }
};

exports.user = function(req, res) {
  var uid = req.params.id;
  db.collection('users', function(err, collection) {
    collection.findOne({uid:uid}, function(err, doc) {
      if(doc === null) {
        res.end();  
      } else {
        GetServiceList(uid, function(achivList) {
          var sum = 0;
          for(var i in achivList) {
            sum += achivList[i].earnedPoints;
          }
          achivList = FixToTargetUid(uid, achivList);
          get_user_stat(uid, sum, function(user_stat) {
            getLatestAchievements(uid, function(last) {
              var friends_flag;
              if(req.session.uid === uid) { friends_flag = false } else {
                friends_flag = CheckFriendships(req.session.uid, user_stat.friends);
              }
              res.render('dashboard.ect', { title: 'Сводка', session: req.session, user_stat: user_stat, achievements: achivList, target_uid: uid, lastAchivArray: last, friends_flag: friends_flag});
            });
          });
        });  
      }
    });
  });
};

exports.getUserAchievements = getUserAchievements;