var config = require('../configs/config.js');
var randomstring = require('randomstring');


var db;

function mongoConnect() {
  var mongodb = require("mongodb"),
    mongoserver = new mongodb.Server(config.mongo.host, config.mongo.port, config.mongo.server_config),
    db_connector = new mongodb.Db('achi-api', mongoserver, config.mongo.connector_config);

  db_connector.open(function(err, dbs) {
    db = dbs;
  });
}

mongoConnect();

function GetUserAppList(uid, cb) {
	db.collection('applications', function(err, collection) {
    collection.find({uid: uid}).toArray(function(err, doc) {
      cb(doc);
    });
  });
}

function TestAllreadyAppCreate(uid, name, cb) {
	db.collection('applications', function(err, collection) {
    collection.find({uid: uid, name: name}).toArray(function(err, doc) {
      if(doc.length > 0) {
        cb(false);
      } else {
        cb(true);
      }
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
			TestAllreadyAppCreate(uid, req.body.name, function(state) {
				if(state) {
					db.collection('applications', function(err, collection) {
            collection.insert({uid: uid, name: req.body.name, url: req.body.url, callback_url: req.body.callback_url, app_id: app_id, app_secret: app_secret}, function(err, doc) {
              res.redirect(config.site.url+'developers');
            });
          });
				} else {
					
				}
			});
		} else {
			res.render('developers_app_create.ect', {title: 'Новое Приложение', session:req.session});
		}
	} else {
		res.redirect(config.site.url);
	}
}

exports.app_show = function(req, res) {
	var app_id = req.params.app_id;
	if(req.body.url) {
		db.collection('applications', function(err, collection) {
			collection.update({uid: req.session.uid, app_id: app_id},{$set: {url: req.body.url, callback_url: req.body.callback_url}}, function(err, doc){
				res.redirect(config.site.url+'developers/app/'+app_id);
			});
		});
	} else {
		db.collection('applications', function(err, collection) {
  		collection.findOne({app_id: app_id, uid: req.session.uid}, function(err, app_info) {
  			console.log(app_info);
  			res.render('developers_app_show.ect', {title: app_info.name, session:req.session, app_info: app_info});
  		});
  	});
  }
}