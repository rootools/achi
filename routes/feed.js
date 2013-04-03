var init = require('../init.js');
var app = init.initModels(['config', 'db', 'users', 'achivments']);

exports.main = function(req, res) {
  if(req.session.auth === false) {
    res.redirect(config.site.url);
  } else {
    app.users.GetUsersFriendsUids(req.session.uid, function(uids_list) {
      uids_list.push(req.session.uid);
      app.users.GetUsersNewsByUids(uids_list, function(latest_achivs) {
        res.render('feed.ect', { title: 'Новости', session:req.session, list: latest_achivs} );
      });
    });
  }
}