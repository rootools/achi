var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Yandex",
    auth: {
        user: "support@achivster.com",
        pass: "AO4dtGvORf"
    }
});

var mailOptions = {
    from: "Achivster Support <support@achivster.com>",
    to: "baboonweb@gmail.com",
    subject: "Hello",
    text: "Hello world", 
    html: "<b>Hello world</b>" 
};

smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
        console.log(error);
    }else{
        console.log("Message sent: " + response.message);
    }

    smtpTransport.close();
});