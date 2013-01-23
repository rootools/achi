exports.main = function(req, res) {
  if(req.session.auth) {
    res.redirect('http://api.achivster.com/authorize?response_type=code&client_id='+req.query.client_id+'&redirect_uri='+req.query.redirect_uri+'&uid='+req.session.uid);
  }
}
