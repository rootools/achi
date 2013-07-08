config = require('../configs/config.js')

db = ''

MongoConnect = ->
  mongodb = require('mongodb')
  mongoserver = new mongodb.Server(config.mongo.host, config.mongo.port, config.mongo.server_config)
  db_connector = new mongodb.Db(config.mongo.db, mongoserver, config.mongo.connector_config)

  db_connector.open (err, dbs) ->
    db = dbs

MongoConnect()

Achivname = (cb) ->
  db.collection 'achievements', (err, collection) =>
    collection.find({$where: "this.description.length < 1"}, {aid: 1, name: 1, _id: 0, description: 1, service: 1}).toArray (err, doc) ->
      cb(doc)

exports.main = (req, res) ->
  if req.session.auth and `req.session.auth === false`
    res.render('offer.ect', { title: 'Акция', session:req.session, message: 'Простите, но принимать участие в акциях могут только зарегистрированные пользователи.'})
  else
    if req.body.aid and req.body.name
      db.collection 'offers', (err, collection) ->
        collection.insert {uid: req.session.uid, aid: req.body.aid, name: req.body.name}, (err, doc) ->
          res.render('offer.ect', { title: 'Акция', session:req.session, message: 'Спасибо за ваш вариант'})
    else
      Achivname (achiv_list) ->
        res.render('offer.ect', { title: 'Акция', session:req.session, achiv_list: achiv_list} )