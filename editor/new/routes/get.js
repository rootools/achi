exports.stat = function(req, res){
  countUsers(function(users){
    countAchivs(function(achivs) {
      countServices(function(service) {
        countServicesConnectionsValid(function(sc_valid) {
          res.json({users: users, achivs: achivs, service: service, sc_valid: sc_valid});
        });
      });
    });
  });
};

function countUsers(cb) {
  mondb.conn.collection('users', function(err,collection) {
    collection.count(function(err, users) {
      cb(users);
    });
  });
}

function countAchivs(cb) {
  mondb.conn.collection('achievements', function(err,collection) {
    collection.count(function(err, achivs) {
      cb(achivs);
    });
  });
}

function countServices(cb) {
  var service = {};
  mondb.conn.collection('services_info', function(err,collection) {
    collection.count({type: "internal"},function(err, internal) {
      service.internal = internal;
        collection.count({type: "external"},function(err, external) {
          service.external = external;
          cb(service);
        });
    });
  });
}

function countServicesConnectionsValid(cb) {
  var result = {};
  mondb.conn.collection('services_connections', function(err,collection) {
    collection.count({valid: true}, function(err, doc) {
      result.valid = doc;
      collection.count({valid: false}, function(err, doc) {
        result.invalid = doc;
        cb(result);
      });
    });
  });
}




