exports.main = function(req, res) {
  res.render('offer.ect', { title: 'Акция', session:req.session} );
};