var app = init.initModels(['users']);

exports.list = function(req, res) {
  app.users.getFriendsList(req.session.uid, function(friends) {
    res.end(JSON.stringify(friends));
  });
}

exports.remove = function(req, res) {
  var uid = req.session.uid;
  var friend_uid = req.body.friend_uid;
  app.users.removeFriendship(uid, friend_uid, function(){
    res.json({});  
  });
}

exports.restore = function(req, res) {
  var uid = req.session.uid;
  var friend_uid = req.body.friend_uid;
  app.users.restoreFriendship(uid, friend_uid, function(){
    res.json({});
  });
}