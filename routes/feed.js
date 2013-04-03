var init = require('../init.js');
var app = init.initModels(['config', 'db', 'users', 'achivments']);
var mod = init.initModules(['underscore', 'moment']);

mod.moment.lang('ru');

function GetLatestAchievements(uids, cb) {
  //var stamp = new Date().getTime() - 604800000;
  var result = [];
  var stamp = 0;
  app.db.conn.collection('users_achievements', function(err, collection) {
    collection.aggregate({$match: {uid: {$in: uids}, achievements: {$elemMatch: {time: {$gt: stamp}}}}},{$group:{_id: "$uid", achivs: {$addToSet: "$achievements"}}}, function(err, doc) {
      for(var i in doc) {
        var arr = mod.underscore.flatten(doc[i].achivs);
        for(var n in arr) {
          arr[n].uid = doc[i]._id;
        }
        result.push(arr);
      }
      result = mod.underscore.flatten(result);
      result.sort(function(a,b){ return a.time - b.time; }).reverse();
      
      //Latest 20 row!!
      result = result.slice(0, 20);

      var aids = [];
      for(var i in result) {
        aids.push(result[i].aid);
      }
      aids = mod.underscore.uniq(aids);

      app.achivments.GetAchievementsInfoByAids(aids, function(achiv_info) {
        for(var k in result) {
          var a = mod.underscore.find(achiv_info, function(re) { return re.aid === result[k].aid });
          result[k].aname = a.name;
          result[k].description = a.description;
          result[k].icon = a.icon;
          result[k].points = a.points;
          result[k].service = a.service;
          var duration = new Date().getTime() - result[k].time;
          result[k].time = mod.moment.duration(duration, "milliseconds").humanize();
        }
        app.users.GetUsersProfiles(uids, function(users) {
          for(var z in result) {
            var u = mod.underscore.find(users, function(re) { return re.uid === result[z].uid });
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
    app.users.GetUsersFriendsUids(req.session.uid, function(uids_list) {
      uids_list.push(req.session.uid);
      GetLatestAchievements(uids_list, function(latest_achivs) {
        res.render('feed.ect', { title: 'Новости', session:req.session, list: latest_achivs} );
      });
    });
  }
}