var underscore = require('underscore');
var nodemailer = require('nodemailer');
var fs = require('fs');
var config = require('../configs/config.js');

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
  fs.readFile('./layout.html', 'utf8', function (err, layout) {
    fs.readFile('./week.html', 'utf8', function (err, restore) {
      mail_layout = layout.replace('||content||', restore);
    });
  });
}

GetMailLayout();
mongoConnect();

function GetUsers(cb){
  var stamp = new Date().getTime() - 604800000;
  db.collection('users_achievements', function(err, collection) {
    collection.aggregate({$match: {achievements: {$elemMatch: {time: {$gt: stamp}}}}},{$group:{_id: "$uid", achivs: {$addToSet: "$achievements"}}}, function(err, doc) {
      for(var i in doc) {
        doc[i].achivs = underscore.flatten(doc[i].achivs);
        var newArr = [];
        for(var n in doc[i].achivs) {
          if(doc[i].achivs[n].time > stamp) {
            newArr.push(doc[i].achivs[n]);
          }
        }
        doc[i].achivs = newArr;
      }
      cb(doc);
    });
  });
};

function GetAchivs(data, cb) {
  var stamp = new Date().getTime() - 604800000;
  var aids = [];

  for(var i in data) {
    for(var n in data[i].achivs) {
      aids.push(data[i].achivs[n].aid);
    }
  }

  aids = underscore.uniq(aids);

  db.collection('achievements', function(err, collection) {
    collection.find({aid: {$in: aids}}, {_id: 0, position: 0}).toArray(function(err, doc) {
      cb(doc);
    });
  });
}

function GetMails(data, cb) {
  var uids = [];
  for(var i in data) {
    uids.push(data[i]._id);
  }
  
  db.collection('users', function(err, collection) {
    collection.find({uid: {$in: uids}, "subscribes.week": true}, {email: 1, _id: 0, uid: 1}).toArray(function(err, doc) {

      for(var i in data) {
        var email = underscore.find(doc, function(re) { return re.uid === data[i]._id});
        if(email === undefined) {
          data[i] = '';
        } else {
          data[i].email = email.email;
        }
      }
      data = underscore.compact(data);
      cb(data);
    });
  });
}

function GenerateArray(data, achivs, cb) {
  
  for(var i in data) {
    var newArr = [];
    for(var n in data[i].achivs) {
      var aid = data[i].achivs[n].aid;
      var a = underscore.find(achivs, function(re) { return re.aid === aid });
      newArr.push(a);
    }
    data[i].achivs = newArr;
  }
  cb(data);
}

function SendMails(data) {
  var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Yandex",
    auth: {
      user: "support@achivster.com",
      pass: "AO4dtGvORf"
    }
  });

  for(var i in data) {
    var message = '<table width="100%" style="font-family: "Segoe UI Light","Open Sans",Verdana,Arial,Helvetica,sans-serif;>';
    for(var n in data[i].achivs) {
      var ach = data[i].achivs[n];
      message += '<tr><td width="64px"><img src="'+config.site.url+ach.icon+'" width="64px"></td>';
      message += '<td><h3>'+ach.name+'</h3><p>'+ach.description+'</p></td>';
      message += '<td width="64px"><h2>'+ach.points+' pts</h2></td></tr>';
      message += '<tr><td colspan="3" style="margin: 0; padding: 0;"><hr style="color: #DDDDDD; opacity: 0.5;"></td>';
    }
    message += '</table>';

    var html = mail_layout.replace('||achivs||', message);

    var mailOptions = {
      from: "Achivster Support <support@achivster.com>",
      to: data[i].email,
      subject: "Achivster - Еженедельная рассылка", 
      html: html
    };

    smtpTransport.sendMail(mailOptions, function(error, response){
      if(error){
        console.log(error);
      }else{
        console.log("Message sent: " + response.message);
      }

      smtpTransport.close();
    });
  }
}

function Mail() {
  GetUsers(function(data) {
    GetMails(data, function(data) {
      GetAchivs(data, function(achivs) {
        GenerateArray(data, achivs, function(data) {
          SendMails(data, function() {
          });
        });
      });
    });
  });
};

setInterval(function(){
  Mail();
}, 604800000);