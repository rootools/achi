var app = init.initModels(['config', 'services']);
var mod = init.initModules(['https', 'querystring', 'request', 'oauth', 'crypto']);

var ext_achivster = require('../external/achivster.js');

var oauth = mod.oauth.OAuth;

var twitterOA = new oauth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  'CXWNIxTwg8vyTmtETDbPMA',
  'd4rgsi9dvbMhUgYVT3kbQD0L9lZ8I8NO8dG2oqOHY',
  '1.0',
  app.config.site.url+'add_service/twitter',
  'HMAC-SHA1'
);

var bitbucketOA = new oauth(
  'https://bitbucket.org/!api/1.0/oauth/request_token',
  'https://bitbucket.org/!api/1.0/oauth/access_token',
  'ENSfZreEzhHYjtWLmG',
  'kbgFjZNAcMADEmpF44c2wrARTrY3NKEY',
  '1.0',
  app.config.site.url+'add_service/bitbucket',
  'HMAC-SHA1'
);

exports.vk = function(req, res) {
  if(!req.query.code) {
    res.redirect('http://oauth.vk.com/authorize?client_id=3126840&scope=notify,friends,photos,audio,video,status,wall,groups,notifications,offline&display=popup&response_type=code&tt=12&redirect_uri='+app.config.site.url+'add_service/vkontakte');
  } else {
    mod.request.get('https://oauth.vk.com/access_token?client_id=3126840&client_secret=nlKuMIbXcEV6HqLn1W1n&code='+req.query.code+'&redirect_uri='+app.config.site.url+'add_service/vkontakte', function(e,r,body) {
      var data = JSON.parse(body);
      delete data.expires_in;
      app.services.add(req.session, data, 'vkontakte', function() {
        res.redirect(app.config.site.url+'dashboard');
      });
    });
  }
};

exports.twitter = function(req, res) {
  if(req.query.oauth_token) {
    twitterOA.getOAuthAccessToken(req.query.oauth_token, req.session.request_twitter_oauth_token_secret, req.query.oauth_verifier, function(err, oauth_token, oauth_token_secret, results) {
      var data = {oauth_token: oauth_token, oauth_token_secret: oauth_token_secret, user_id: results.user_id, screen_name: results.screen_name };
      app.services.add(req.session, data, 'twitter', function(){
        delete req.session.twitter_request_oauth_token_secret;
        res.redirect(app.config.site.url+'dashboard');
      });
    });
  } else {
    twitterOA.getOAuthRequestToken(function(error, request_oauth_token, request_oauth_token_secret, results){
      req.session.twitter_request_oauth_token_secret = request_oauth_token_secret;
      res.redirect('https://api.twitter.com/oauth/authorize?oauth_token='+request_oauth_token);
    });
  }
};

exports.facebook = function(req, res) {
  if(!req.query.code) {  
    res.redirect('https://www.facebook.com/dialog/oauth?client_id=258024554279925&redirect_uri='+app.config.site.url+'add_service/facebook&state=123&scope=publish_actions,user_photos,user_likes,read_stream');
  } else {
    var code = req.query.code;

    mod.request.get('https://graph.facebook.com/oauth/access_token?client_id=258024554279925&redirect_uri='+app.config.site.url+'add_service/facebook&client_secret=7ae18b84811c2b811dd11d31050f2e4e&code='+code, function(e, r, body){
      var data = mod.querystring.parse(body).access_token;
      app.services.add(req.session, data, 'facebook', function(){
        res.redirect(app.config.site.url+'dashboard');
      });
    });

  }
};

exports.bitbucket = function(req, res) {
  if(req.query.oauth_token) {
    bitbucketOA.getOAuthAccessToken(req.session.request_oauth_token, req.session.request_oauth_token_secret, req.query.oauth_verifier, function(error, oauthAccessToken, oauthAccessTokenSecret, results){
      var data = {token: oauthAccessToken, secret: oauthAccessTokenSecret};
      app.services.add(req.session, data, 'bitbucket', function(){
        delete req.session.request_oauth_token;
        delete req.session.request_oauth_token_secret;
        res.redirect(app.config.site.url+'dashboard');
      });
    });
  } else {
    bitbucketOA.getOAuthRequestToken(function(error, request_oauth_token, request_oauth_token_secret, results){
      req.session.request_oauth_token = request_oauth_token;
      req.session.request_oauth_token_secret = request_oauth_token_secret;
      res.redirect('https://bitbucket.org/!api/1.0/oauth/authenticate?oauth_token='+request_oauth_token);
    });
  }
};

exports.github = function(req, res) {
  if(!req.query.code) {
    res.redirect('https://github.com/login/oauth/authorize?client_id=1167c7508199dd90ba7c&scope=user,repo:status,gist');
  } else {
    mod.request.post('https://github.com/login/oauth/access_token', {form: {
      client_id: '1167c7508199dd90ba7c',
      client_secret: '4521cb71a4dd118099810a98028c302b66ad3fa8',
      code: req.query.code}}, function(e, r, body) {
        var data = mod.querystring.parse(body);
        app.services.add(req.session, data, 'github', function(){
          res.redirect(app.config.site.url+'dashboard');
        });
    });
  }
};

exports.instagram = function(req, res) {
  if(!req.query.code) {
    res.redirect('https://api.instagram.com/oauth/authorize/?client_id=952cd8726937430f86a277c7133b0df4&redirect_uri=http://achivster.com/add_service/instagram&response_type=code');
  } else {
    var code = req.query.code;
  
    mod.request.post('https://api.instagram.com/oauth/access_token', {form:{client_id: '952cd8726937430f86a277c7133b0df4', client_secret: '8f7fcd3306854371bc7b1486706cfb37', grant_type: 'authorization_code', redirect_uri: 'http://achivster.com/add_service/instagram',code:code}}, function(e, r, body){
      var token = JSON.parse(body).access_token;
      var id = JSON.parse(body).user.id;
      app.services.add(req.session, {access_token: token, id: id}, 'instagram', function(){
        res.redirect(app.config.site.url+'dashboard');
      });
    });
  } 
};

exports.foursquare = function(req, res) {
  if(!req.query.code) {
    res.redirect('https://foursquare.com/oauth2/authenticate?client_id=ZJ3Q5X3NIYGJNBMWC1Q5KZC0RLDNNBNIJ5Y2V4X0GIQTMK3J&response_type=code&redirect_uri=http://achivster.com/add_service/foursquare');
  } else {
    var code = req.query.code;
    mod.request.post('https://foursquare.com/oauth2/access_token', {form:{client_id: 'ZJ3Q5X3NIYGJNBMWC1Q5KZC0RLDNNBNIJ5Y2V4X0GIQTMK3J', client_secret: 'NJ4PUMNEO3ZVKYCML1V5CSMN5TJAPDYDHF4TRQLLITKZKC2R', grant_type: 'authorization_code', redirect_uri: 'http://achivster.com/add_service/foursquare',code:code}}, function(e, r, body){
      var token = JSON.parse(body).access_token;
      app.services.add(req.session, {access_token: token}, 'foursquare', function(){
        res.redirect(app.config.site.url+'dashboard');
      });
    });
  }
}

exports.odnoklassniki = function(req, res) {
  if(!req.query.code) {
    res.redirect('http://www.odnoklassniki.ru/oauth/authorize?client_id=174988544&scope=VALUABLE ACCESS&response_type=code&redirect_uri=http://achivster.com/add_service/odnoklassniki');
  } else {
    var code = req.query.code;
    mod.request.post('http://api.odnoklassniki.ru/oauth/token.do', {form :{
      code: code,
      redirect_uri: 'http://achivster.com/add_service/odnoklassniki',
      grant_type: 'authorization_code',
      client_id: 174988544,
      client_secret: '3835C62F2369CCB8E64D3163'
      }}, function(e, r, body) {
        var body = JSON.parse(body);
        var access_token = body.access_token;
        var refresh_token = body.refresh_token;
        app.services.add(req.session, {refresh_token: refresh_token}, 'odnoklassniki', function(){
          res.redirect(app.config.site.url+'dashboard');
        });
    });
  }
}
