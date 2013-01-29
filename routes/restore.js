var config = require('../configs/config.js');
var randomstring = require('randomstring');
var nodemailer = require('nodemailer');
var fs = require('fs');

var redis = require('redis'),
   client = redis.createClient();
   client.select(8);

var db;
var mail_layout;

function mongoConnect() {
  var mongodb = require("mongodb"),
    mongoserver = new mongodb.Server(config.mongo.host, config.mongo.port, config.mongo.server_config),
    db_connector = new mongodb.Db(config.mongo.db, mongoserver, config.mongo.connector_config);

  db_connector.open(function(err, dbs) {
    db = dbs;
  });
}

function GetMailLayout() {
  fs.readFile('./mailer/layout.html', 'utf8', function (err, layout) {
    fs.readFile('./mailer/restore.html', 'utf8', function (err, restore) {
      mail_layout = layout.replace('||content||', restore);
    });
  });
}

mongoConnect();
GetMailLayout();

function SendEmailCode(email, cb) {
  var code = randomstring.generate(40);
  client.set(code, email, function(err, res){
    client.expire(code, 3600000);
  });

  var smtpTransport = nodemailer.createTransport("SMTP",{
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

function CheckEmail(email, cb) {
  db.collection('users', function(err, collection) {
    collection.findOne({email: email}, function(err, doc) {
      if(doc === null) {
        cb(false, null);
      } else {
        cb(true, doc.uid);
      }
    });
  });
}

exports.main = function(req, res) {
  if(!req.session.auth) {
    if(req.body.email) {
      CheckEmail(req.body.email, function(check, uid) {
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
    res.redirect(config.site.url);
  }
};

exports.code = function(req, res) {
  var code = req.query.code;
  client.get(code, function(err, email){
    CheckEmail(email, function(check, uid) {
      req.session.auth = true;
      req.session.uid = uid;
      req.session.email = email;
      res.redirect(config.site.url);
    });
  });
};