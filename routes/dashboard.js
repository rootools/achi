var app = init.initModels(['config', 'db', 'achivments', 'users', 'services']);
var mod = init.initModules(['async']);


exports.main = function(req, res) {
  var uid = req.session.uid;
  app.users.GetServiceList(uid, function(achivList) {
    var sum = 0;
    for(var i in achivList) {
      sum += achivList[i].earnedPoints;
    }
    app.users.getStat(uid, sum, function(user_stat) {
      app.achivments.getLatest(uid, function(last) {
        res.render('dashboard.ect', { title: 'Сводка', session: req.session, user_stat: user_stat, achievements: achivList, lastAchivArray: last});
      });
    });  
  });
};

exports.service = function(req, res) {
  app.achivments.getByServiceUser(req.params.service, req.session.uid, function(data){
    var service_info_count = app.achivments.getCountFromService(data);
    app.services.getServiceInfo(req.params.service, function(serviceInfo) {
      res.render('dashboard_service.ect', { title: 'Сводка', list:data, service_info:serviceInfo, service_info_count: service_info_count,session: req.session});
    });
  });
};

exports.user = function(req, res) {
  var uid = req.params.id;
  app.db.conn.collection('users', function(err, collection) {
    collection.findOne({uid:uid}, function(err, doc) {
      if(doc === null) {
        res.end();  
      } else {
        app.users.GetServiceList(uid, function(achivList) {
          var sum = 0;
          for(var i in achivList) {
            sum += achivList[i].earnedPoints;
          }
          achivList = FixToTargetUid(uid, achivList);
          app.users.getStat(uid, sum, function(user_stat) {
            app.achivments.getLatest(uid, function(last) {
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

exports.service_user = function(req, res) {
  app.achivments.getByServiceUser(req.params.service, req.params.id, function(data){
    app.services.getServiceInfo(req.params.service, function(serviceInfo) {
      var service_info_count = app.achivments.getCountFromService(data);
      res.render('dashboard_service.ect', { title: 'Сводка', list:data, service_info:serviceInfo, service_info_count: service_info_count,session: req.session});
    });
  });
};

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