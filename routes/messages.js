var app = init.initModels(['db', 'users']);

exports.get = function(req, res) {
  app.db.conn.collection('messages', function(err, collection) {
    collection.find({target_uid: req.session.uid}, {_id: 0, owner_uid: 1, data: 1, type: 1, time: 1}).toArray(function(err, doc) {
      var uids = [];
      for(var i in doc) {
        uids.push(doc[i].owner_uid);
      }
      app.users.getByUidsInfo(uids, function(info) {
        for(var i in info) {
          for(var n in doc) {
            if(info[i].uid === doc[n].owner_uid) {
              info[i].time = doc[n].time;
              info[i].data = doc[n].data;
            }
          }
        }
        res.json({messages: info});
      });
    });
  });
}
