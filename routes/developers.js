var config = require('../configs/config.js');
var randomstring = require('randomstring');


var db;
var db_api;

function mongoConnectApi() {
  var mongodb = require("mongodb"),
    mongoserver = new mongodb.Server(config.mongo.host, config.mongo.port, config.mongo.server_config),
    db_connector = new mongodb.Db('achi-api', mongoserver, config.mongo.connector_config);

  db_connector.open(function(err, dbs) {
    db_api = dbs;
  });
}

function mongoConnect() {
  var mongodb = require("mongodb"),
    mongoserver = new mongodb.Server(config.mongo.host, config.mongo.port, config.mongo.server_config),
    db_connector = new mongodb.Db(config.mongo.db, mongoserver, config.mongo.connector_config);

  db_connector.open(function(err, dbs) {
    db = dbs;
  });
}

mongoConnectApi();
mongoConnect();

function GetUserAppList(uid, cb) {
	db_api.collection('applications', function(err, collection) {
    collection.find({uid: uid}).toArray(function(err, doc) {
      cb(doc);
    });
  });
}

function WriteNewAchiv(name, descr, points, app_id, cb) {
  var aid = randomstring.generate(30);
  db_api.collection('applications', function(err, collection) {
    collection.findOne({app_id: app_id}, {_id: 0, name: 1}, function(err, doc) {
      var serv_name = doc.name;
      db.collection('achievements', function(err, collection) {
        collection.insert({aid: aid, name: name, description: descr, icon: '/images/label.png', points: points, service: serv_name, app_id: app_id, position: 1}, function(err, collection){
          cb();
        });
      });
    });
  });
}

function UpdateAchiv(name, descr, points, aid, cb) {
  db.collection('achievements', function(err, collection) {
    collection.update({aid: aid},{$set: {name: name, description: descr, points: points}}, function(err, collection){
      cb();
    });
  });
}

function GetAchivmentsByService(app_id, cb) {
  db.collection('achievements', function(err, collection) {
    collection.find({app_id: app_id}).toArray(function(err, doc){
      cb(doc);
    });
  });
}

exports.main = function(req, res) {
	if(req.session.auth) {
		GetUserAppList(req.session.uid, function(app_list) {
			console.log(app_list);
			res.render('developers.ect', { title: 'Разработчикам', session:req.session, app_list: app_list});
		});
	} else {
		res.redirect(config.site.url);
	}
};

exports.app_create = function(req, res) {
	if(req.session.auth) {
		if(req.body.url) {
			var uid = req.session.uid;
			var app_id = randomstring.generate(15);
			var app_secret = randomstring.generate(40);
			db_api.collection('applications', function(err, collection) {
        collection.insert({uid: uid, name: req.body.name, url: req.body.url, callback_url: req.body.callback_url, app_id: app_id, app_secret: app_secret}, function(err, doc) {
          res.redirect(config.site.url+'developers');
        });
      });
		} else {
			res.render('developers_app_create.ect', {title: 'Новое Приложение', session:req.session});
		}
	} else {
		res.redirect(config.site.url);
	}
};

exports.app_show = function(req, res) {
  if(req.session.auth) {
    var app_id = req.params.app_id;
    if(req.body.url) {
      db_api.collection('applications', function(err, collection) {
        collection.update({uid: req.session.uid, app_id: app_id},{$set: {url: req.body.url, callback_url: req.body.callback_url}}, function(err, doc){
          res.redirect(config.site.url+'developers/app/'+app_id);
        });
      });
    } else if(req.body.achiv_name){
      var name = req.body.achiv_name;
      var descr = req.body.achiv_description;
      var points = parseFloat(req.body.points);
      WriteNewAchiv(name, descr, points, app_id, function() {
        res.redirect(config.site.url+'developers/app/'+app_id);
      });
    } else if(req.body.edit_achiv_name) {
      var name = req.body.edit_achiv_name;
      var descr = req.body.edit_achiv_description;
      var aid = req.body.edit_achiv_aid;
      var points = parseFloat(req.body.edit_achiv_points);
      UpdateAchiv(name, descr, points, aid, function() {
        res.redirect(config.site.url+'developers/app/'+app_id);
      });
    } else {
      db_api.collection('applications', function(err, collection) {
        collection.findOne({app_id: app_id, uid: req.session.uid}, function(err, app_info) {
          GetAchivmentsByService(app_id, function(achiv_list) {
            res.render('developers_app_show.ect', {title: app_info.name, session:req.session, app_info: app_info, achiv_list:achiv_list});
          });
        });
      });
    }
	} else {
    res.redirect(config.site.url);
	}
};