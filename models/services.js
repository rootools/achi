var app = require('../init.js').initModels(['config', 'db']);

exports.GetServiceInfo = function(service, cb) {
  app.db.conn.collection('services_info', function(err, collection) {
    collection.findOne({service:service}, {_id: 0}, function(err, doc) {  
      cb(doc);
    });
  });
}