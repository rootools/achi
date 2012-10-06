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
      	cb(doc, last);
      });
    });
  });
}

// HASH IT!!
function getAllAchievementsCount(cb) {
	var result = {};
	db.collection('achievements', function(err, collection) {
		collection.find({},{service: 1}).toArray(function(err, doc) {
			for(var i=0;i<doc.length;i++){
				if(result[doc[i].service] != undefined) {
					result[doc[i].service] += 1;
				} else {
					result[doc[i].service] = 1;
				}
			}
			cb(result);
		});
	});
}

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

	getUserAchievements(req.session.uid, function(achivList, lastAchivArray) {
		getAllAchievementsCount(function(allAchievements) {
			for(var i=0;i<achivList.length;i++){
				var tmpObj = {};
				tmpObj.service = achivList[i].service;
				tmpObj.earned = achivList[i].achievements.length;
				tmpObj.full = allAchievements[achivList[i].service];
				achivStat.push(tmpObj);
			}

			//achivStat.push({service:'main', earned: 12, full: 24});
			res.render('dashboard', { title: 'Dashboard', achievements: achivStat, lastAchivArray:lastAchivArray });
		});
	});
}