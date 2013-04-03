var init = require('../init.js');
var app = init.initModels(['db', 'achivments', 'files']);
var mod = init.initModules(['underscore', 'moment', 'async']);

mod.moment.lang('ru');

//get_user_stat
exports.getStat = function (uid, points, cb) {
  app.db.conn.collection('users_profile', function(err, collection) {
    collection.findOne({uid: uid},{name: 1, _id: 0, photo: 1, friends: 1}, function(err, doc) {
      doc.points = points;
      cb(doc);
    });
  });
}

exports.getPointSum = function(uid, cb) {
  app.db.conn.collection('users_achievements', function(err, collection) {
    collection.find({uid: uid},{achievements: 1, _id: 0}).toArray(function(err, doc) {

    var aids = [];

    for(var i in doc) {
      for(var r in doc[i].achievements) {
        aids.push(doc[i].achievements[r].aid);
      }
    }

    if(aids.length === 0) {
      cb(0);
    } else {
      app.db.conn.collection('achievements', function(err, collection) {
        collection.find({aid: {$in: aids}}, {points:1, _id: 0}).toArray(function(err, doc) {
          var points = 0;
          for(var i in doc) {
            points += doc[i].points;
          }
          cb(points);
        });
      });
    }

    });
  });
}

//GetNameByUid
exports.getName = function (uid, cb) {
  app.db.conn.collection('users_profile', function(err, collection) {
    collection.findOne({uid: uid},{name: 1, _id: 0}, function(err, doc) {
      cb(doc.name);
    });
  });
}

exports.getProfiles = function(uids, cb) {
  app.db.conn.collection('users_profile', function(err, collection) {
    collection.find({uid: {$in: uids}}, {_id: 0, name: 1, photo: 1, uid: 1}).toArray(function(err, doc) {
      cb(doc);
    });
  });
}

exports.getFriendsUids = function(uid, cb) {
  app.db.conn.collection('users_profile', function(err, collection) {
    collection.findOne({uid: uid}, {_id:0, friends: 1}, function(err, doc) {
      cb(doc.friends);
    });
  });
}

//get_friends_list
exports.getFriendsList = function (uid, cb) {
  var friends_list = [];
  exports.getFriendsUids(uid, function(friends_uid_list) {
      
    var handler = friends_uid_list.length;
    if(handler === 0) {
      cb([]);
    }      
    
    function callback(uid) {
      collection.findOne({uid: uid},{_id: 0, friends: 0}, function(err, profile) {
        exports.getPointSum(uid, function(points) {
          profile.points = points;
          if(profile.name === '') { profile.name = 'anonymous'};
          friends_list.push(profile);
          handler--;
          if(handler === 0) {
            cb(friends_list);
          }
        });
      });
    }
    
    mod.async.forEach(friends_uid_list, callback, function(err) {});
  });
}

exports.getNewsByUids = function(uids, cb) {
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
        exports.getProfiles(uids, function(users) {
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

//get_messages
exports.getMessages = function (uid, limit, cb) {
  var messages = [];
  app.db.conn.collection('messages', function(err, collection) {
    collection.find({target_uid: uid}).toArray(function(err, doc) {
      
    var handler = doc.length;
    if(handler === 0) {
      cb([]);
    }
    
    function callback(message) {
      app.db.conn.collection('users_profile', function(err, collection) {
        collection.findOne({uid: message.owner_uid},{name: 1, _id: 0, photo: 1}, function(err, doc) {
          message.owner_name = doc.name;
          message.time = mod.moment(message.time).format('DD.MM.YYYY hh:mm');
          message.photo = doc.photo;
          messages.push(message);
          handler--;
          if(handler === 0) {
            cb(messages);
          }
        });
      });
    }    
    
    mod.async.forEach(doc, callback, function(err) {});
    });
  });
}

exports.GetServiceList = function(uid, cb) {
  mod.async.parallel({
    
    info: function(callback) {
      app.db.conn.collection('services_info', function(err, collection) {
        collection.find({type: 'internal'},{_id:0}).toArray(function(err, services_info) {
          callback(null, services_info);
        });
      });
    },
    
    connections: function(callback) {
      app.db.conn.collection('services_connections', function(err, collection) {
        collection.find({uid: uid},{valid: 1, service: 1, _id:0}).toArray(function(err, services_connections) {
          callback(null, services_connections);
        });
      });
    },
    
    users_achievements: function(callback) {
      app.db.conn.collection('users_achievements', function(err, collection) {
        collection.find({uid: uid},{service: 1, achievements: 1, _id:0}).toArray(function(err, data) {
          var handler = data.length;
          var users_achievements = [];

          var q = mod.async.queue(function(task) {
            var aids = [];
            for(var h in task.achievements) {
              aids.push(task.achievements[h].aid);
            }
            
            app.db.conn.collection('achievements', function(err, collection) {
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
      app.db.conn.collection('achievements', function(err, collection) {
        collection.aggregate({$group: {_id: "$service", points: {$sum: "$points"}, count: {$sum: 1}}}, function(err, doc) {
          callback(null, doc);
        });
      });
    },
    external: function(callback) {
      app.db.conn.collection('services_connections', function(err, collection) {
        collection.find({uid: uid, type: 'external'},{_id:0, app_id: 1}).toArray(function(err, services_connections) {
          var app_ids = [];
          for(var i in services_connections) {
            app_ids.push(services_connections[i].app_id);
          }
          app.db.conn.collection('services_info', function(err, collection) {
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

// upload_profile_photo_from_url
exports.uploadProfilePhotoFromUrl = function(url, uid, cb) {
  var path = app.config.dirs.profilePhotos+'/'+uid+'.jpg';

  app.files.downloadFromUrl(url, path, function (params) {

    params.quality = 90;
    params.width = 194;
    params.height = 194;
    params.fill = true;

    app.files.convertImage(params, function () {
      app.files.createThumbnail(params, function () {

        app.db.collection('users_profile', function(err,profile) {
          profile.findOne({uid: uid}, function(err, doc) {
            if(doc === null) {
              profile.insert({uid: uid, photo: app.config.dirs.profilePhotos+'/'+uid+'.jpg'}, function(err, doc) {
                cb({});
              });
            } else {
              profile.update({uid: uid},{$set: {photo: app.config.dirs.profilePhotos+'/'+uid+'.jpg'}}, function(err, doc) {
                cb({});
              });
            }
          });
        });

      });
    });

  });
}

//UploadIcon
exports.uploadIcon = function (image, uid, cb) {
  var file = image.path.split('/');
  file = file[file.length-1];

  params = {
    path: app.config.dirs.uploads+'/'+file,
    quality: 90,
    width: 194,
    height: 194,
    fill: true
  }

  app.files.convertImage(params, function () {
      app.files.createThumbnail(params, function () {
        fs.rename(params.path, app.config.dirs.profilePhotos+'/'+uid+'.jpg', function() {
          cb();
        })
    });
  });
}