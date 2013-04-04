var mod = init.initModules(['fs', 'redis', 'nodemailer', 'randomstring']);

var client = mod.redis.createClient();
    client.select(8);

var mail_restore_layout, mail_invite_layout;

getMailRestoreLayout(function(layout) {
  mail_restor_layout = layout;
});

getMailInviteLayout(function(layout) {
  mail_invite_layout = layout;
});

function getMailRestoreLayout(cb){
  mod.fs.readFile('./mailer/layout.html', 'utf8', function (err, layout) {
    mod.fs.readFile('./mailer/restore.html', 'utf8', function (err, restore) {
      mail_layout = layout.replace('||content||', restore);
      cb(mail_layout);
    });
  });
}

function getMailInviteLayout(cb) {
  mod.fs.readFile('./mailer/layout.html', 'utf8', function (err, layout) {
    mod.fs.readFile('./mailer/invite_friend.html', 'utf8', function (err, restore) {
      mail_layout = layout.replace('||content||', restore);
      cb(mail_layout);
    });
  });
}

exports.sendEmailRestoreCode = function(email, cb) {
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

exports.sendEmailInvite = function(email, name, key, cb) {
  var smtpTransport = mod.nodemailer.createTransport("SMTP",{
    service: "Yandex",
    auth: {
        user: "support@achivster.com",
        pass: "AO4dtGvORf"
    }
  });

  var html = mail_invite_layout.replace('||username||', '<b>'+name+'</b>');
  html = html.replace('||key||', key);

  var mailOptions = {
    from: "Achivster Support <support@achivster.com>",
    to: email,
    subject: "Получи свое первое достижение!", 
    html: html
  };

  smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
      console.log(error);
    }else{
      console.log("Message sent: " + response.message);
    }

    smtpTransport.close();
    cb();
  });
}
