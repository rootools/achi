var app = require('../init.js').init(['db', 'async', 'top', 'users']);

exports.main = function(req, res) {
  app.top.WorldTop(function(world_list) {
    app.top.FriendsTop(req.session.uid, function(friends_list) {
      res.render('top.ect', { title: 'Топ', session:req.session, friends_list: friends_list, world_list: world_list});
    });
  });
};