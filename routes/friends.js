var app = init.initModels(['users']);

exports.list = function(req, res) {
  app.users.getFriendsList(req.session.uid, function(friends) {
    res.end(JSON.stringify(friends));
  });
}
