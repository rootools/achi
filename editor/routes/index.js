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

exports.index = function(req, res){
  res.render('index.ect', { title: 'Express' });
};

exports.editor_api = function(req, res) {
  
  if(req.body.command == 'get_service_list') {
    db.collection('achievements', function(err, collection) {
      collection.distinct('service', function(err, doc) {
        var data = JSON.stringify({data: doc});
        res.contentType('json');
        res.end(data);
      });
    });
  }

  if(req.body.command == 'get_achiv_list') {
    db.collection('achievements', function(err, collection) {
      collection.find({service:req.body.service},{sort: 'position'}).toArray(function(err, doc) {
        var data = JSON.stringify({data: doc});
        res.contentType('json');
        res.end(data);
      });
    });
  }

  if(req.body.command == 'add_new_achiv') {
    db.collection('achievements', function(err, collection) {
      collection.insert({aid:req.body.aid, name:req.body.name, description:req.body.description, position: parseInt(req.body.position), service:req.body.service, points:parseInt(req.body.service.points), icon:req.body.icon},function(err, doc) {});
      res.redirect('http://achivster.com:3000/');
    });
  }

  if(req.body.command == 'delete_row') {
    db.collection('achievements', function(err, collection) {
      collection.remove({aid:req.body.aid}, function(err, doc) {});
      res.end();
    });
  }

  if(req.body.command == 'edit_achiv') {
    db.collection('achievements', function(err, collection) {
      collection.update({aid:req.body.aid},{$set:{name:req.body.name, description:req.body.description, position:parseInt(req.body.position), points:parseInt(req.body.points), icon:req.body.icon}}, function(err, doc) {});
      res.redirect('http://achivster.com:3000/');
    });
  }
  
  if(req.body.command === 'get_users_list') {
    db.collection('users', function(err, collection) {
      collection.find({}).toArray(function(err, doc) {
        var data = JSON.stringify({data: doc});
        res.contentType('json');
        res.end(data);
      });
    });
  }
  
  if(req.body.command === 'get_offer_list') {
    db.collection('offers', function(err, collection) {
      collection.find({}).sort([['aid',1]]).toArray(function(err, doc) {
        AddNameToOfferList(doc, function(list) {
          var data = JSON.stringify({data: list});
          res.contentType('json');
          res.end(data);
        });
      });
    });
  }

  if(req.body.command === 'remove_user') {
    var uid = req.body.uid;
    db.collection('users', function(err,collection) {
    collection.remove({uid: uid}, function(err, doc) {
      db.collection('users_profile', function(err,profiles) {
        profiles.remove({uid: uid}, function(err, doc) {
          db.collection('services_connections', function(err, services_connections) {
            services_connections.remove({uid: uid}, function(err, doc) {
              db.collection('users_achievements', function(err, users_achievements) {  
                users_achievements.remove({uid: uid}, function(err, doc) {});
                var data = JSON.stringify({});
                res.contentType('json');
                res.end(data);
              });
            });
          });
        });
      });
    });
  });
  }
};

function AddNameToOfferList(data, cb) {
  var aid_list = [];
  for(var i in data) {
    aid_list.push(data[i].aid);
  }

  db.collection('achievements', function(err,collection) {
    collection.find({aid: {$in: aid_list}},{name: 1, service: 1, aid: 1, _id:0}).toArray(function(err, doc) {
      for(var i in data) {
        for(var t in doc) {
          if(data[i].aid === doc[t].aid) {
            data[i].service = doc[t].service;
            data[i].descr = doc[t].name;
          }
        }
      }
      cb(data);
    });
  });
}
