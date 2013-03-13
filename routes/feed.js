var config = require('../configs/config.js');
var underscore = require('underscore');
var moment = require('moment');
moment.lang('ru');

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

function CreateUids(uid, cb) {
  db.collection('users_profile', function(err, collection) {
    collection.findOne({uid: uid}, {_id:0, friends: 1}, function(err, doc) {
      var result = doc.friends;
      result.push(uid);
      cb(result);
    });
  });
}

function GetAchivInfo(data, cb) {
  var aids = [];
  for(var i in data) {
    aids.push(data[i].aid);
  }
  aids = underscore.uniq(aids);

  db.collection('achievements', function(err, collection) {
    collection.find({aid: {$in: aids}}, {_id: 0, position: 0}).toArray(function(err, doc) {
      cb(doc);
    });
  });
}

function GetUsersProfiles(uids, cb) {
  db.collection('users_profile', function(err, collection) {
    collection.find({uid: {$in: uids}}, {_id: 0, name: 1, photo: 1, uid: 1}).toArray(function(err, doc) {
      cb(doc);
    });
  });
}

function GetLatestAchievements(uids, cb) {
  //var stamp = new Date().getTime() - 604800000;
  var result = [];
  var stamp = 0;
  db.collection('users_achievements', function(err, collection) {
    collection.aggregate({$match: {uid: {$in: uids}, achievements: {$elemMatch: {time: {$gt: stamp}}}}},{$group:{_id: "$uid", achivs: {$addToSet: "$achievements"}}}, function(err, doc) {
      for(var i in doc) {
        var arr = underscore.flatten(doc[i].achivs);
        for(var n in arr) {
          arr[n].uid = doc[i]._id;
        }
        result.push(arr);
      }
      result = underscore.flatten(result);
      result.sort(function(a,b){ return a.time - b.time; }).reverse();
      
      //Latest 20 row!!
      result = result.slice(0, 20);

      GetAchivInfo(result, function(achiv_info) {
        for(var k in result) {
          var a = underscore.find(achiv_info, function(re) { return re.aid === result[k].aid });
          result[k].aname = a.name;
          result[k].description = a.description;
          result[k].icon = a.icon;
          result[k].points = a.points;
          result[k].service = a.service;
          var duration = new Date().getTime() - result[k].time;
          result[k].time = moment.duration(duration, "milliseconds").humanize();
        }
        GetUsersProfiles(uids, function(users) {
          for(var z in result) {
            var u = underscore.find(users, function(re) { return re.uid === result[z].uid });
            result[z].name = u.name;
            result[z].photo = u.photo;
          }
          
          cb(result);
        });

      });

    });
  });
}

exports.main = function(req, res) {
  if(req.session.auth === false) {
    res.redirect(config.site.url);
  } else {
    CreateUids(req.session.uid, function(uids_list) {
      GetLatestAchievements(uids_list, function(latest_achivs) {
        res.render('feed.ect', { title: 'Новости', session:req.session, list: latest_achivs} );
      });
    });
  }
}