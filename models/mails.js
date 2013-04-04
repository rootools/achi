var mod = init.initModules(['fs', 'redis', 'nodemailer', 'randomstring']);

var client = mod.redis.createClient();
    client.select(8);

var mail_restore_layout;
GetMailRestoreLayout(function(layout) {
  mail_restor_layout = layout;
});

function GetMailRestoreLayout(cb){
  mod.fs.readFile('./mailer/layout.html', 'utf8', function (err, layout) {
    mod.fs.readFile('./mailer/restore.html', 'utf8', function (err, restore) {
      mail_layout = layout.replace('||content||', restore);
      cb(mail_layout);
    });
  });
}

exports.SendEmailRestoreCode = function(email, cb) {
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
  var html = mail_restor_layout.replace('||link||', message);

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
