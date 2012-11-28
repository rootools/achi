var http = require('http');
var url = require('url');
var fs = require('fs');
var easyimg = require('easyimage');
var db;

function mongoConnect() {
  var mongodb = require("mongodb"),
    mongoserver = new mongodb.Server('127.0.0.1', 27017, {auto_reconnect: true}),
    db_connector = new mongodb.Db('achi', mongoserver, {safe: true});

  db_connector.open(function(err, dbs) {
    db = dbs;
  });
}

mongoConnect();

function upload_profile_photo_from_url(download_url, uid, cb) {
  var dir = './public/images/users_photo/';
  
  var options = {
    host: url.parse(download_url).host,
    port: 80,
    path: url.parse(download_url).pathname
  };
  
  var file_name = url.parse(download_url).pathname.split('/').pop();
  var file = fs.createWriteStream(dir + file_name);
  
  http.get(options, function(res) {
    res.on('data', function(data) {
      file.write(data);
    });
    
    res.on('end', function() {
      file.end();
      convertImage(dir, file_name, uid, function(status) {
        write_to_db(uid, function(status) {
          cb({});
        });
      });
    });
  
  });
}

function write_to_db(uid, cb) {
  db.collection('users_profile', function(err,profile) {
    profile.findOne({uid: uid}, function(err, doc) {
      if(doc === null) {
        profile.insert({uid: uid, photo: '/images/users_photo/'+uid+'.jpg'}, function(err, doc) {
          cb({});
        });
      } else {
        profile.update({uid: uid},{$set: {photo: '/images/users_photo/'+uid+'.jpg'}}, function(err, doc) {
          cb({});
        });
      }
    });
  });
}

function convertImage(dir, file_name, uid, cb) {
  easyimg.convert({src: dir+file_name, dst: dir+uid+'.jpg', quality:90}, function(err, stdout, stderr) {
    easyimg.resize({src: dir+uid+'.jpg', dst: dir+uid+'.jpg', width: 194, height:194}, function(err, stdout, stderr) {
      if(uid+'.jpg' !== file_name) {
        fs.unlink(dir+file_name, function(err, res) {});
        cb({});
      }
    });
  });
}

exports.main = function(req, res) {
  if(req.body.action === 'upload_profile_photo_from_url') {
    upload_profile_photo_from_url(req.body.url, req.session.uid, function(status) {
      res.end(JSON.stringify({}));
    });
  }
};