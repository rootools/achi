var dashboard = require('./dashboard.js');
var db;

function mongoConnect() {
  var mongodb = require("mongodb"),
    mongoserver = new mongodb.Server('127.0.0.1', 27017, {auto_reconnect: true, safe: false}),
    db_connector = new mongodb.Db('achi', mongoserver, '');

  db_connector.open(function(err, dbs) {
    db = dbs;
  });
}

mongoConnect();

function routing(req, res) {
  if(req.session.auth === true) {
    try {
      var runFunc = eval(req.body.action);
      runFunc(req, res);
    } catch(e) {
      console.log(e + 'Error Method');
      res.end('');
    }
  } else {
    res.end('');
  }
}

function addService(req, res) {
  testService(req.session.uid, req.body.service, function(check) {
    if(check) {
      db.collection('services_connections', function(err,collection) {
        collection.insert({uid: req.session.uid, service:req.body.service, service_login: req.body.account, addtime:new Date().getTime(), valid: true, lastupdate:''}, function(err, doc) {
          errorist(res, 'Database Error', 'OK');
        });
      });
    } else {
      res.end('Allready in DB');
    }
  });
  res.end('');
}

function testService(uid, service, cb) {
  db.collection('services_connections', function(err,collection) {
    collection.findOne({uid: uid, service:service}, function(err, doc) {
      if(err === null && doc === null) {
        cb(true);
      } else {
        cb(false);
      }
    });
  });
}

function getAchievementsList(req, res) {
  db.collection('achievements', function(err,collection) {
    collection.find({service:req.body.service}).sort({position: 1}).toArray(function(err, data) {
      res.end(JSON.stringify(data));
    });
  });
}

function userAchievementsList(req, res) {
  db.collection('users_achievements', function(err,collection) {
    collection.findOne({uid:req.session.uid, service:req.body.service},{achievements:1},function(err ,data) {
      res.end(JSON.stringify(data));
    });
  });
}


function errorist(res, errS, normalS) {
  if(err !== null) {
    res.end(errS);
  } else {
    res.end(normalS);
  }
}

function find_by_email(req, res) {
  var email = req.body.email;
  db.collection('users', function(err,collection) {
    collection.findOne({email: email},{uid: 1, _id: 0, email: email}, function(err, doc) {
      if(doc === null) {
        res.end(JSON.stringify({error: 'Did not match'}));
      } else {
        dashboard.getUserAchievements(doc.uid, function(smth, last, data) {
          var sum = 0;
          for(var i in data) {
            sum += data[i];
          }
          doc.points = sum;
          doc.last = last[0].name;
          res.end(JSON.stringify(doc));
        });
      }
    });
  });
}

exports.routing = routing;
