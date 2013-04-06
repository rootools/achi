init = require('./init.js');
rootdir = __dirname;
var config = require('./configs/config.js');

// Init modules
// Basic Express modules
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var i18n = require('i18n');


var authRoutes = require('./routes/auth');
var restore = require('./routes/restore');
var webApi = require('./routes/webApi');
var dashboard = require('./routes/dashboard');
var profile = require('./routes/profile');
var top_list = require('./routes/top');
var add_service = require('./routes/add_service');
var upload = require('./routes/upload');
var offer = require('./routes/offer');
var offer2 = require('./routes/offer2');
var oauth_route = require('./routes/oauth');
var developers = require('./routes/developers');
var feed = require('./routes/feed');

var sessionsStorage = require('connect-redis')(express);

var app = express();
var ECT = require('ect');
var ectRenderer = ECT({ cache: false, watch: false, root: config.dirs.views });

app.engine('.ect', ectRenderer.render);

app.configure(function(){
  app.set('port', process.env.PORT || config.site.port);
  app.set('views', config.dirs.views);
//  app.set('view engine', 'ect');
  app.use(i18n.init);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser({keepExtensions: true, uploadDir: config.dirs.uploads}));
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ store: new sessionsStorage({db: 7}), secret: 'lolcat', cookie:{maxAge: 1209600000} }));
  // Mine locale hack
  app.use(function(req, res, next) {
    i18n.setLocale(req.session.locale);
    next();
  });

  app.use(app.router);
  app.use(express.static(config.dirs.public));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

i18n.configure({
  locales:['en', 'ru'],
  defaultLocale: 'ru',
  directory: config.dirs.locale,
  debug: true
});

app.all('/', routes.index);
app.all('/login', authRoutes.login);
app.all('/logout', authRoutes.logout);
app.all('/restore', restore.main);
app.all('/restore/code', restore.code);
app.all('/webapi', webApi.routing);
app.all('/dashboard', checkAuth, dashboard.main);
app.all('/dashboard/:service', checkAuth, dashboard.service);
app.all('/dashboard/:service/user/:id', checkAuth, dashboard.service_user);
app.all('/dashboard/user/:id', checkAuth, dashboard.user);
app.all('/top', checkAuth, top_list.main);
app.all('/profile', checkAuth, profile.main);
app.all('/profile/save', checkAuth, profile.save);
app.all('/profile/invite_friend', checkAuth, profile.invite_friend);
app.all('/upload', upload.main);
app.all('/offer', offer.main);
app.all('/offer2', offer2.main);
app.all('/oauth', oauth_route.main);
app.all('/developers', checkAuth, developers.main);
app.all('/developers/app/create', checkAuth, developers.app_create);
app.all('/developers/app/:app_id', checkAuth, developers.app_show);
app.all('/feed', checkAuth, feed.main);

app.all('/lol', function(req,res) {
  req.session.locale = 'ru';
  var a = i18n.__('hello');
  res.end(a);
});

app.all('/add_service/vkontakte', checkAuth, add_service.vk);
app.all('/add_service/twitter', checkAuth, add_service.twitter);
app.all('/add_service/facebook', checkAuth, add_service.facebook);
app.all('/add_service/bitbucket', checkAuth, add_service.bitbucket);
app.all('/add_service/github', checkAuth, add_service.github);
app.all('/add_service/instagram', checkAuth, add_service.instagram);
app.all('/add_service/foursquare', checkAuth, add_service.foursquare);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

function checkAuth(req, res, next) {
  if (req.session.auth === false) {
    res.redirect(config.site.url);
  } else {
    next();
  }
}