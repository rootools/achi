var app = require('../init.js').init(['db']);

//get_user_stat
exports.getStat = function (uid, points, cb) {
  app.db.conn.collection('users_profile', function(err, collection) {
    collection.findOne({uid: uid},{name: 1, _id: 0, photo: 1, friends: 1}, function(err, doc) {
      doc.points = points;
      cb(doc);
    });
  });
}