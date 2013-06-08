var app = init.initModels(['config', 'db', 'users']);

exports.getPoints = function(req, res) {
  app.users.getPointSum(req.session.uid, function(points) {
    res.json(points);
  });
};