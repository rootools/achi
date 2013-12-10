var app = init.initModels(['db']);

exports.addPayment = function(uid, cb) {
  var time = new Date().getTime();
  var address = '';
  
  app.db.conn.collection('payment', function(err, collection) {
    collection.find({},{_id: 0, invoiceID: 1}).sort({invoiceID: -1}).limit(1).toArray(function(err, doc) {
      var last_invoiceID = doc[0].invoiceID;
        collection.insert({uid: uid, time: time, status: null, invoiceID: last_invoiceID + 1}, function(err, doc){
          cb(last_invoiceID + 1);
        });
    });
  });
};

exports.setPaymentStatus = function(status, invoiceID, cb) {
  invoiceID = parseInt(invoiceID);
  app.db.conn.collection('payment', function(err, collection) {
    collection.update({invoiceID: invoiceID}, {$set: {status: status}}, function(err,doc){
      cb();
    });
  });
};