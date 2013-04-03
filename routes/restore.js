var app = init.initModels(['config', 'users']);
var mod = init.initModules(['randomstring', 'redis', 'nodemailer', 'fs']);


var client = mod.redis.createClient();
   client.select(8);

var mail_layout;

function GetMailLayout() {
  mod.fs.readFile('./mailer/layout.html', 'utf8', function (err, layout) {
    mod.fs.readFile('./mailer/restore.html', 'utf8', function (err, restore) {
      mail_layout = layout.replace('||content||', restore);
    });
  });
}

GetMailLayout();

function SendEmailCode(email, cb) {
  var code = mod.randomstring.generate(40);
  client.set(code, email, function(err, res){
    client.expire(code, 3600000);
  });

  var smtpTransport = mod.nodemailer.createTransport("SMTP",{
    service: "Yandex",
    auth: {
      user: "support@achivster.com",
      pass: "AO4dtGvORf"
    }
  });

  var message = '<a href="http://achivster.com/restore/code?code='+code+'">http://achivster.com/restore/code?code='+code+'</a>';
  var html = mail_layout.replace('||link||', message);

  var mailOptions = {
    from: "Achivster Support <support@achivster.com>",
    to: email,
    subject: "Восстановление пароля", 
    html: html
  };

  smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
      console.log(error);
    }else{
      cb();
      console.log("Message sent: " + response.message);
    }

    smtpTransport.close();
  });
}

exports.main = function(req, res) {
  if(!req.session.auth) {
    if(req.body.email) {
      app.users.test(req.body.email, function(check) {
        if(check) {
          SendEmailCode(req.body.email, function(){
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