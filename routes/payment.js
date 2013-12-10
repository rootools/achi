var app = init.initModels(['db', 'payment']);
var mod = init.initModules(['crypto']);

exports.special1 = function(req, res) {
  var uid = req.session.uid;
  app.payment.addPayment(uid, function(invoiceID) {
    var signMD5 = mod.crypto.createHash('md5').update('Achivster-icon:300:'+invoiceID+':59jZOYo8zScpU3l:shpuid='+uid).digest('hex');
    var request = 'http://test.robokassa.ru/Index.aspx?MrchLogin=Achivster-icon&OutSum=300&InvId='+invoiceID+'&SignatureValue='+signMD5+'&shpuid='+uid;
    res.redirect(request);
  });
};

exports.robokassa = function(req, res) {
  var status = req.params.status;
  var data = req.query;
  var invoiceID = data.InvId;
  app.payment.setPaymentStatus(status, invoiceID, function() {
    res.end();
  });
};