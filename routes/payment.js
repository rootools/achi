var app = init.initModels(['db', 'payment']);
var mod = init.initModules(['crypto']);

exports.special1 = function(req, res) {
  var uid = req.session.uid;
  var address = req.query.address;
  var price = calcPrice(uid);
  app.payment.addPayment(uid, address, function(invoiceID) {
    var signMD5 = mod.crypto.createHash('md5').update('Achivster-icon:'+price+':'+invoiceID+':59jZOYo8zScpU3l:shpuid='+uid).digest('hex');
    var request = 'http://test.robokassa.ru/Index.aspx?MrchLogin=Achivster-icon&OutSum='+price+'&InvId='+invoiceID+'&SignatureValue='+signMD5+'&shpuid='+uid;
    res.redirect(request);
  });
};

exports.robokassa = function(req, res) {
  var status = req.params.status;
  var data = req.query;
  var invoiceID = data.InvId;
  app.payment.setPaymentStatus(status, invoiceID, function() {
    if(status === 'success') {
      res.redirect('http://achivster.com/#/payment/true');
    } else {
      res.redirect('http://achivster.com/#/payment/false');
    }
  });
};

exports.getPrice = function(req, res) {
  var price = calcPrice(req.session.uid);
  res.json({price: price});
};

function calcPrice(uid) {
  var group = (uid.charCodeAt(uid.length -1)) % 3;
  var price;
  
  if(group === 0) {
    price = 100;
  } else if(group === 1) {
    price = 150;
  } else {
    price = 200;
  }
  
  return price;
}