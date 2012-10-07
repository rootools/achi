var hd = require('hero-data');
var passwordHash = require('password-hash');
var moment = require('moment');
var async = require('async');

var db;

function mongoConnect() {
  var mongodb = require("mongodb"),
    mongoserver = new mongodb.Server('127.0.0.1', 27017, {auto_reconnect: true}),
    db_connector = new mongodb.Db('achi', mongoserver, '');

  db_connector.open(function(err, dbs) {
    db = dbs;
  });
}

mongoConnect();

// HASH IT!!
function getUserAchievements(uid, cb) {
  var achivList = {};
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
		var serv_obj = {name:'', points: 0};

		for(var r in data[i].achievements) {
			aids.push(data[i].achievements[r].aid);
		}
	}

	var handler = aids.length

	function callback(aid) {
		db.collection('achievements', function(err, collection) {
			collection.findOne({aid:aid},{service: 1, points:1}, function(err, doc) {
				pointsList.push({service:doc.service, points: doc.points});
				handler--;
				if(handler == 0) {
					var response = {};
					for(var j in pointsList) {
						if(response[pointsList[j].service] != undefined) {
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
				if(result[doc[i].service+'_count'] != undefined) {
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

	achivArray.sort(function(a,b){ return a.time - b.time; }).reverse();
	var lastAchivArray = achivArray.slice(0, 6);

	var result = [];

	var handler = lastAchivArray.length;

	var callback = function(i) {
		return function(err, doc) {
			result.push({time:lastAchivArray[i].time, points:doc.points, icon:doc.icon, name:doc.name, service:doc.service});
			handler--;
			if(handler == 0) {
				result.sort(function(a,b){ return a.time - b.time; }).reverse();
				for(var key in result) {
					result[key].time = moment(result[key].time).format('DD/MM/YYYY');
				}
				cb(result);
			}
		}
	}

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
				tmpObj.fullPoints = allAchievements[achivList[i].service+'_points'];
				achivStat.push(tmpObj);
			}
			//achivStat.push({service:'main', earned: 12, full: 24});
			res.render('dashboard', { title: 'Dashboard', achievements: achivStat, lastAchivArray:lastAchivArray });
		});
	});
}