var app = init.initModels(['users']);

exports.list = function(req, res) {
  req.session.uid = 'SW7QtRBCUVgZeelC6DVx';
  app.users.getFriendsList(req.session.uid, function(friends) {
    res.end(JSON.stringify(friends));
  });
}
