var app = init.initModels(['config', 'db', 'achivments']);
var mod = init.initModules(['i18n']);


exports.main = function(req, res) {
  console.log(mod.i18n.__('hello'));
  if(!req.session.auth || req.session.auth === false) {
    res.render('offer.ect', { title: 'Акция', session:req.session, message: 'Простите, но принимать участие в акциях могут только зарегистрированные пользователи.'} );
  } else {
    if(req.body.aid && req.body.name) {
      app.db.conn.collection('offers', function(err, collection) {
        collection.insert({uid: req.session.uid, aid: req.body.aid, name: req.body.name}, function(err, doc) {
          res.render('offer.ect', { title: 'Акция', session:req.session, message: 'Спасибо за ваш вариант'} );
        });
      });
    } else {
      app.achivments.achivName(function(achiv_list) {
        res.render('offer.ect', { title: 'Акция', session:req.session, achiv_list: achiv_list} );
      });
    }
  }
};
