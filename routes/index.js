var init = require('../init.js');
var app = init.initModels(['config']);

exports.index = function(req, res){
  if(!req.session.auth || req.session.auth === false) {
    res.render('index.ect', { title: 'Ачивстер', session: req.session, error: ''});
  } else {
    res.redirect(app.config.site.url+'dashboard');
  }
};
