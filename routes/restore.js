var app = init.initModels(['config', 'users', 'mails']);
var mod = init.initModules(['randomstring', 'redis', 'nodemailer', 'fs']);

var client = mod.redis.createClient();
    client.select(8);

exports.main = function(req, res) {
  if(!req.session.auth) {
    if(req.body.email) {
      app.users.test(req.body.email, function(check) {
        if(check) {
          app.mails.sendEmailRestoreCode(req.body.email, function(){
            res.render('restore.ect', { title: 'Восстановление пароля', session:req.session, message: 'Вам выслан код для смены пароля.'});
          });
        } else {
          res.render('restore.ect', { title: 'Восстановление пароля', session:req.session, message: 'Пользователь не найден. Пожалуйста, убедитесь, что правильно ввели e-mail.'});
        }
      });
    } else {
      res.render('restore.ect', { title: 'Восстановление пароля', session:req.session});
    }
  } else {
    res.redirect(app.config.site.url);
  }
};

exports.code = function(req, res) {
  var code = req.query.code;
  client.get(code, function(err, email){
    app.users.test(email, function(check, uid) {
      req.session.auth = true;
      req.session.uid = uid;
      req.session.email = email;
      res.redirect(app.config.site.url);
    });
  });
};