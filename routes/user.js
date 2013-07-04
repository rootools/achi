var app = init.initModels(['config', 'db', 'users']);

exports.points = function(req, res) {
  if(req.body.uid) {
    var uid = req.body.uid;
  } else {
    var uid = req.session.uid;
  }
  app.users.getPointSum(uid, function(points) {
    res.json(points);
  });
};

exports.info = function(req, res) {
  app.users.getInfo(req.body.shortname, function(info) {

    for(var i in info.friends) {      
      if(info.friends[i] === req.session.uid) {
        info.friendship = true;
        break;
      } else {
        info.friendship = false;
      }
    }
    res.json(info);
  });
};
