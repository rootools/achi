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
  res.render('index', { title: 'Express' });
};

exports.editor_api = function(req, res) {
  console.log(req.body);

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
      collection.insert({aid:req.body.aid, name:req.body.name, description:req.body.description, position: req.body.position, service:req.body.service},function(err, doc) {});
      res.redirect('http://rootools.ru:3000/');
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
      collection.update({aid:req.body.aid},{$set:{name:req.body.name, description:req.body.description, position:req.body.position}}, function(err, doc) {});
      res.redirect('http://rootools.ru:3000/');
    });
  }
};