var juice = require('juice');
var nodemailer = require('nodemailer');

var config = require('../../configs/config.js');

var db;

function mongoConnect() {
  var mongodb = require("mongodb"),
    mongoserver = new mongodb.Server(config.mongo.host, config.mongo.port, config.mongo.server_config),
    db_connector = new mongodb.Db(config.mongo.db, mongoserver, config.mongo.connector_config);

  db_connector.open(function(err, dbs) {
    db = dbs;
  });
}

mongoConnect();

var smtpTransport = nodemailer.createTransport("SMTP",{
  service: "Yandex",
  auth: {
    user: "support@achivster.com",
    pass: "AO4dtGvORf"
  }
});

setTimeout(function(){
	db.collection('users', function(err, collection) {
		collection.find({"subscribes.news": true},{_id: 0, email: 1}).toArray(function(err, data) {
			for(var i in data) {
				sendMail(data[i].email);
			}			
		});
	});
}, 500);

function sendMail(email) {
	juice('./mail.html', function(err, html) {
		var mailOptions = {
	    from: "Achivster Support <support@achivster.com>",
	    to: email,
	    subject: "Achivster - Новости",
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
	});  	
}
