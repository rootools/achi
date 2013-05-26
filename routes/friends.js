var app = init.initModels(['users']);

exports.list = function(req, res) {
  app.users.getFriendsList('SW7QtRBCUVgZeelC6DVx', function(friends) {
    res.end(JSON.stringify(friends));
  });
}