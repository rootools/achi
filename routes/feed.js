var app = init.initModels(['config', 'db', 'users', 'achivments']);

exports.list = function(req, res) {
  app.users.getFriendsUids(req.session.uid, function(uids_list) {
    uids_list.push(req.session.uid);
    app.users.getNewsByUids(uids_list, function(latest_achivs) {
      res.end(JSON.stringify(latest_achivs));
    });
  });
}
