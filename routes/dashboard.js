var config = require('../configs/config.js');
var moment = require('moment');
var async = require('async');

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

  var handler = aids.length;

	function callback(aid) {
		db.collection('achievements', function(err, collection) {
			collection.findOne({aid:aid},{service: 1, points:1, _id:0}, function(err, doc) {
				pointsList.push({service:doc.service, points: doc.points});
				handler--;
				if(handler === 0) {
					var response = {};
					for(var j in pointsList) {
						if(response[pointsList[j].service] !== undefined) {
							response[pointsList[j].service] += pointsList[j].points;
						} else {
							response[pointsList[j].service] = pointsList[j].points;							
						}
					}
          cb(response);
				}
			});
		});
	}
	
	async.forEach(aids, callback, function(err) {});
	
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
function getLatestAchievements(data, cb) {

  var achivArray = [];
	for(var key in data) {
		var array = data[key].achievements;
		for(var inKey in array) {
			achivArray.push(array[inKey]);
		}
	}

  if(achivArray.length === 0) {
    cb([]);
  }

  achivArray.sort(function(a,b){ return a.time - b.time; }).reverse();
	var lastAchivArray = achivArray.slice(0, 6);

  var result = [];

	var handler = lastAchivArray.length;

	var callback = function(i) {
		return function(err, doc) {
			result.push({time:lastAchivArray[i].time, points:doc.points, icon:doc.icon, name:doc.name, service:doc.service});
			handler--;
			if(handler === 0) {
				result.sort(function(a,b){ return a.time - b.time; }).reverse();
				for(var key in result) {
					result[key].time = moment(result[key].time).format('DD.MM.YYYY');
				}
				cb(result);
			}
		};
	};

	db.collection('achievements', function(err, collection) {
		for(var key in lastAchivArray) {
			collection.findOne({aid:lastAchivArray[key].aid},{points:1, icon:1, service:1, name:1}, callback(key));
		}
	});
}

exports.main = function(req, res) {
	var achivStat = [];

	getUserAchievements(req.session.uid, function(achivList, lastAchivArray, points) {
		getAllAchievementsCount(function(allAchievements) {
			for(var i=0;i<achivList.length;i++){
				var tmpObj = {};
				tmpObj.service = achivList[i].service;
				tmpObj.earned = achivList[i].achievements.length;
				tmpObj.full = allAchievements[achivList[i].service+'_count'];
				tmpObj.earnedPoints = points[achivList[i].service];
          if(tmpObj.earnedPoints === undefined) {tmpObj.earnedPoints = 0;}
				tmpObj.fullPoints = allAchievements[achivList[i].service+'_points'];
				achivStat.push(tmpObj);
			}
			//achivStat.push({service:'main', earned: 12, full: 24});
			res.render('dashboard.ect', { title: 'Dashboard', achievements: achivStat, lastAchivArray:lastAchivArray, session: req.session });
		});
	});
};

exports.service = function(req, res) {
  getUserAchievementsByService(req.params.service, req.session.uid, function(data){
    getServiceInfo(req.params.service, function(serviceInfo) {
      res.render('dashboard_service.ect', { title: req.params.service, list:data, service_info:serviceInfo, session: req.session});
    });
  });
};

// HASH IT!!
function getUserAchievementsByService(service, uid, cb) {
  db.collection('users_achievements', function(err, collection) {
    collection.findOne({uid:uid, service:service},{achievements:1}, function(err, udoc) {
      db.collection('achievements', function(err, collection) {
        collection.find({service:service},{sort: 'position'}).toArray(function(err, doc) {
          cb(markedEarnedAchievements(udoc.achievements, doc));
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

exports.getUserAchievements = getUserAchievements;