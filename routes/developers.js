var app = init.initModels(['config', 'users', 'db', 'achivments']);
var mod = init.initModules(['randomstring']);


function GetAchivmentsByService(app_id, cb) {
  app.db.conn.collection('achievements', function(err, collection) {
    collection.find({app_id: app_id}, {sort: 'position'}).toArray(function(err, doc){
      cb(doc);
    });
  });
}

exports.main = function(req, res) {
	if(req.session.auth) {
		app.getAppList(req.session.uid, function(app_list) {
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
			var app_id = mod.randomstring.generate(15);
			var app_secret = mod.randomstring.generate(40);
			app.db.conn_api.collection('applications', function(err, collection) {
        collection.insert({uid: uid, name: req.body.name, url: req.body.url, callback_url: req.body.callback_url, app_id: app_id, app_secret: app_secret}, function(err, doc) {
          app.db.conn.collection('services_info', function(err, collection) {
            collection.insert({icon: '/images/label.png', service: req.body.name, app_id: app_id, type: 'external'}, function(err, doc) {
              res.redirect(config.site.url+'developers');
            });
          });
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
      app.db.conn_api.collection('applications', function(err, collection) {
        collection.update({uid: req.session.uid, app_id: app_id},{$set: {url: req.body.url, callback_url: req.body.callback_url}}, function(err, doc){
          res.redirect(config.site.url+'developers/app/'+app_id);
        });
      });
    } else if(req.body.achiv_name){
      var name = req.body.achiv_name;
      var descr = req.body.achiv_description;
      var points = parseFloat(req.body.points);
      app.achivments.new(name, descr, points, app_id, function() {
        res.redirect(config.site.url+'developers/app/'+app_id);
      });
    } else if(req.body.edit_achiv_name) {
      var name = req.body.edit_achiv_name;
      var descr = req.body.edit_achiv_description;
      var aid = req.body.edit_achiv_aid;
      var points = parseFloat(req.body.edit_achiv_points);

      app.achivments.uploadIcon(req.files.image, aid, function(path) {
        app.achivments.update(name, descr, points, aid, path, function() {
          res.redirect(config.site.url+'developers/app/'+app_id);
        });
      });
    } else {
      app.db.conn_api.collection('applications', function(err, collection) {
        collection.findOne({app_id: app_id, uid: req.session.uid}, function(err, app_info) {
          app.achivments.getByService(app_id, function(achiv_list) {
            res.render('developers_app_show.ect', {title: app_info.name, session:req.session, app_info: app_info, achiv_list:achiv_list});
          });
        });
      });
    }
	} else {
    res.redirect(config.site.url);
	}
};
