var hd = require('hero-data');
var passwordHash = require('password-hash');
var db;

function mongoConnect() {
  var mongodb = require("mongodb"),
    mongoserver = new mongodb.Server('127.0.0.1', 27017, {auto_reconnect: true}),
    db_connector = new mongodb.Db('achi', mongoserver, '');

  db_connector.open(function(err, dbs) {
    db = dbs;
  });
}

mongoConnect();

function routing(req, res) {
  if(req.session.auth == true) {
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
        collection.insert({uid: req.session.uid, service:req.body.service, service_login: req.body.account, addtime:new Date().getTime()}, function(err, doc) {
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
      if(err == null && doc == null) {
        cb(true);
      } else {
        cb(false);
      }
    });
  });
}

function errorist(res, errS, normalS) {
  if(err != null) {
    res.end(errS);
  } else {
    res.end(normalS);
  }
}

exports.routing = routing;
