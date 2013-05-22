var app = init.initModels(['config']);

exports.index = function(req, res){
  console.log(req.session);
  if(!req.session.auth || req.session.auth === false) {
    res.render('login.ect');
  } else {
    res.redirect(app.config.site.url+'dashboard');
  }
};
