var mod = init.initModules(['crypto']);

exports.special1 = function(req, res) {
  var uid = req.session.uid;
  var signMD5 = mod.crypto.createHash('md5').update('Achivster-icon:300:1:59jZOYo8zScpU3l:shpuid='+uid).digest('hex');
  var request = 'http://test.robokassa.ru/Index.aspx?MrchLogin=Achivster-icon&OutSum=300&InvId=1&SignatureValue='+signMD5+'&shpuid='+uid;
  res.redirect(request);
};

exports.robokassa = function(req, res) {
  var status = req.params.status;
  var data = req.query;
  res.end();
}