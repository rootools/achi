var app = init.initModels(['config', 'db', 'users']);
var mod = init.initModules(['request', 'crypto']);

exports.getServiceInfo = function(service, cb) {
  app.db.conn.collection('services_info', function(err, collection) {
    collection.findOne({service:service}, {_id: 0}, function(err, doc) {  
      cb(doc);
    });
  });
};

//get_service_icon
exports.getIcons = function (cb) {
  app.db.conn.collection('services_info', function(err, collection){
    collection.find({},{service:1, icon:1, _id: 0}).toArray(function(err, doc){
      cb(doc);
    });
  });
};

//add_service
exports.add = function (session, account, service, cb) {
  testService(session.uid, service, function(check, is_first) {
    if(is_first) {
      get_user_name_by_service(session.uid, service, account, function() {
        write_newuser_to_db(function(){
          cb();
        });
      });
    } else {
      write_newuser_to_db(function(){
        cb();
      });
    }
    
    function write_newuser_to_db(cbk) {
      app.db.conn.collection('services_connections', function(err,collection) {
        app.db.conn.collection('users_achievements', function(err, ua_collection) {
          if(check) {
            collection.insert({uid: session.uid, service:service, service_login: account, addtime:new Date().getTime(), valid: true, lastupdate: new Date().getTime() - 3600000, type: 'internal'}, function(err, doc) {
              ua_collection.insert({uid:session.uid, service:service, achievements: [], type: 'internal'}, function(err, doc) {
                cbk();
              });
            });
          } else {
            collection.update({uid: session.uid, service:service},{$set: {service_login: account, valid: true}}, function(err,doc) {
              cbk();
            });
          }
        });
      });
    }
    
  });
};

function testService(uid, service, cb) {
  
  app.db.conn.collection('services_connections', function(sc_err,sc_collection) {
  app.db.conn.collection('users_achievements', function(ua_err, ua_collection) {
    sc_collection.find({uid: uid}).toArray(function(sc_err, sc_doc) {
    var is_first = false;
    var check = true;
    if(sc_doc.length === 2) {
      is_first = true;
    }
    
    // Earned achiv for first service
    if(sc_doc.length === 2) {
      ext_achivster.main(uid, 'eSkuacz7tW1yUayFp1Xes710UNc8u1');
    }
    
    if(sc_doc.length === 7) {
      ext_achivster.main(uid, 'zsEwcqJlT568iO9C3MaDeGyskjdZUb');
    }
    
    ua_collection.findOne({uid: uid, service:service}, function(ua_err, ua_doc) {
      for(var i in sc_doc) {
        if(sc_doc[i].service === service) {
          check = false;
        }
      }  
      
      if(sc_err === null && ua_err === null && ua_doc === null) {
        check = true;
      } else {
        check = false;
      }
      cb(check, is_first);
    });
  });
  });
  });
}

function get_user_name_by_service(uid, service, account, cb) {
  var name = '';
  var image = '';
  
  if(service === 'twitter') {
    twitterOA.get('https://api.twitter.com/1.1/account/verify_credentials.json', account.oauth_token, account.oauth_token_secret, function(err, data) {
      data = JSON.parse(data);
      image = data.profile_image_url;
      name = data.name;
      write_name_and_image_from_service(uid, image, name, function() {
        cb();
      });
    });
  }
  
  if(service === 'facebook') {
    var query = {};
    query.info = 'SELECT+pic_big,name+FROM+user+WHERE+uid=me()';
    query = JSON.stringify(query);
    
    mod.request.get('https://graph.facebook.com/fql?q='+query+'&access_token='+account, function(e, r, body){
      body = JSON.parse(body);
      body = body.data[0].fql_result_set[0];
      name = body.name;
      image = body.pic_big;
      write_name_and_image_from_service(uid, image, name, function() {
        cb();
      });
    });
  }
  
  if(service === 'vkontakte') {
    var vkontakte = require('vkontakte')(account.access_token);
    vkontakte('users.get', {uids: account.user_id, fields: 'nickname,photo_medium'}, function(err, data) {
      data = data[0];
      name = data.first_name+' '+data.last_name;
      image = data.photo_medium;
      write_name_and_image_from_service(uid, image, name, function() {
        cb();
      });
    });
  }

  if(service === 'bitbucket') {
    bitbucketOA.get('https://api.bitbucket.org/1.0/user', account.token, account.secret, function(err, data){
      data = JSON.parse(data).user;
      image = data.avatar;
      name = data.display_name;
      write_name_and_image_from_service(uid, image, name, function() {
        cb();
      });
    });
  }

  if(service === 'github') {
    mod.request.get('https://api.github.com/user?access_token='+account.access_token, function(e, r, body){
      var data = JSON.parse(body);
      image = data.avatar_url;
      name = data.name;
      write_name_and_image_from_service(uid, image, name, function() {
        cb();
      });
    });
  }
  
  if(service === 'instagram') {
    mod.request.get('https://api.instagram.com/v1/users/'+account.id+'/?access_token='+account.access_token, function(e, r, body){
      name = JSON.parse(body).data.full_name;
      image = JSON.parse(body).data.profile_picture;
      write_name_and_image_from_service(uid, image, name, function() {
        cb();
      });
    });
  }

  if(service === 'foursquare') {
    mod.request.get('https://api.foursquare.com/v2/users/self?oauth_token='+account.access_token, function(e,r,body) {
      name = JSON.parse(body).response.user.firstName + ' ' + JSON.parse(body).response.user.lastName;
      image = JSON.parse(body).response.user.photo;
      write_name_and_image_from_service(uid, image, name, function() {
        cb();
      });
    });
  }

  if(service === 'odnoklassniki') {
    mod.request.post('http://api.odnoklassniki.ru/oauth/token.do', {form: {
      refresh_token: account.refresh_token,
      grant_type: 'refresh_token',
      client_id: 174988544,
      client_secret: '3835C62F2369CCB8E64D3163'}}, function(e, r, body){
        var access_token = JSON.parse(body).access_token;
        var sig = mod.crypto.createHash('md5').update([
          'application_key=CBAOBPGLABABABABA',
          'method=users.getCurrentUser',
          mod.crypto.createHash('md5').update(access_token + '3835C62F2369CCB8E64D3163', 'utf8').digest('hex')
        ].join(''), 'utf8').digest('hex');
        
        mod.request.get('http://api.odnoklassniki.ru/fb.do?method=users.getCurrentUser&access_token='+access_token+'&application_key=CBAOBPGLABABABABA&sig='+sig, function(e, r, body) {
          body = JSON.parse(body);
          name = body.name;
          image = body.pic_2;
          write_name_and_image_from_service(uid, image, name, function() {
            cb();
          });
        });
      });
  }

}

function write_name_and_image_from_service(uid, image, name, cb) {
  app.users.uploadProfilePhotoFromUrl(image, uid, function() {
    app.db.conn.collection('users_profile', function(ua_err, users_profile) {
      users_profile.update({uid: uid}, {$set: {name: name}}, function(sc_err, sc_doc) {
        cb();
      });
    });
  });
}
