var app = init.initModels(['users']);

exports.main = function(req, res) {
  if(req.body.action === 'upload_profile_photo_from_url') {
    app.users.uploadProfilePhotoFromUrl(req.body.url, req.session.uid, function(status) {
      res.end(JSON.stringify({}));
    });
  }
};

exports.upload_profile_photo_from_url = app.users.uploadProfilePhotoFromUrl;