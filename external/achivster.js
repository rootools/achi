var app = init.initModels(['config', 'db', 'users']);

function TestAllreadyEarned(uid, aid, cb) {
  app.db.collection('users_achievements', function(err, collection) {
    collection.findOne({uid: uid, service: 'achivster'}, {_id: 0, achievements: 1}, function(err, doc) {
      var list = doc.achievements;
      var flag = true;
      for(var i in list) {
        if(list[i].aid === aid) {
          flag = false;
        }
      }
      cb(flag);
    });
  });
}

function write(uid, aid) {
  TestAllreadyEarned(uid, aid, function(check) {
  if(check) {
    app.db.collection('users_achievements', function(err, collection) {
      collection.update({uid:uid, service: 'achivster'}, {$push: {achievements:{aid:aid, time:new Date().getTime()}} }, function(err, doc) {});
    });
  }
  });
}

exports.main = function(uid, aid) {
  write(uid, aid);
};

exports.rare = function(uid, aid) {
  app.db.collection('users_achievements', function(err, collection) {
    collection.update({uid:uid, service: 'rare'}, {$push: {achievements:{aid:aid, time:new Date().getTime()}} }, function(err, doc) {});
  });
};

exports.check_first_friend = function(uid) {
  app.db.collection('users_achievements', function(err, users_achievements) {
    users_achievements.findOne({uid: uid, service: 'achivster'}, {_id: 0, achievements: 1}, function(err, achiv_list) {
      achiv_list = achiv_list.achievements;
      for(var i in achiv_list) {
        if(achiv_list[i].aid === 'xfRYH7bizdL9GgvPnhjgJlKedF18uj') {
          return;
        }
      }
      write(uid, 'xfRYH7bizdL9GgvPnhjgJlKedF18uj');
    });
  });
};

exports.thousand = function(uid) {
  TestAllreadyEarned(uid, 'nTqbJqaOI0OMj6FqzxVJ02uTs76GeH', function(check) {
    if(check) {
      app.users.getPointSum(uid, function(points) {
        if(points >= 1000) {
          write(uid, 'nTqbJqaOI0OMj6FqzxVJ02uTs76GeH');
        }
      });
    }
  });
};