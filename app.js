init = require('./init.js');
rootdir = __dirname;
var config = require('./configs/config.js');
config.rootdir = __dirname;

// Init modules
// Basic Express modules
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var authRoutes = require('./routes/auth');
var restore = require('./routes/restore');
var webApi = require('./routes/webApi');

var profile = require('./routes/profile');
var add_service = require('./routes/add_service');
var upload = require('./routes/upload');
var offer = require('./routes/offer');
var offer2 = require('./routes/offer2');
var oauth_route = require('./routes/oauth');
var developers = require('./routes/developers');

// New API routes
var dashboard = require('./routes/dashboard');
var friends = require('./routes/friends');
var feed = require('./routes/feed');
var top = require('./routes/top');
var user = require('./routes/user');
var messages = require('./routes/messages');

var sessionsStorage = require('connect-redis')(express);

var app = express();
var ECT = require('ect');
var ectRenderer = ECT({ cache: false, watch: false, root: config.dirs.views });

app.engine('.ect', ectRenderer.render);

app.configure(function(){
  app.set('port', process.env.PORT || config.site.port);
  app.set('views', config.dirs.views);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser({keepExtensions: true, uploadDir: config.dirs.uploads}));
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ store: new sessionsStorage({db: 7}), secret: 'lolcat', cookie:{maxAge: 1209600000} }));
  app.use(app.router);
  app.use(express.static(config.dirs.public));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.all('/login', routes.login);
app.all('/logout', routes.logout);

app.post('/friends', checkAuth, friends.list);
app.post('/friends/accept', checkAuth, friends.accept);
app.post('/friends/reject', checkAuth, friends.reject);
app.post('/friends/remove', checkAuth, friends.remove);
app.post('/friends/restore', checkAuth, friends.restore);
app.post('/friends/add', checkAuth, friends.add);
app.post('/feed', checkAuth, feed.list);
app.post('/top/world', checkAuth, top.world);
app.post('/top/friends', checkAuth, top.friends);
app.all('/dashboard', checkAuth, dashboard.main);
app.post('/dashboard/latest', checkAuth, dashboard.latest);
app.post('/dashboard/service_list', checkAuth, dashboard.service_list);
app.post('/dashboard/:service', checkAuth, dashboard.service);
app.post('/profile', checkAuth, profile.get);
app.post('/profile/save', checkAuth, profile.save);
app.post('/profile/save/avatar', checkAuth, profile.save_avatar);
//app.all('/dashboard/:service/user/:id', dashboard.service_user);
//app.all('/dashboard/user/:id', checkAuth, dashboard.user);

app.post('/user/points', checkAuth, user.points);
app.post('/user/info', checkAuth, user.info);

app.post('/messages/get', checkAuth, messages.get);
/*app.all('/restore', restore.main);
app.all('/restore/code', restore.code);
app.all('/webapi', webApi.routing);
app.all('/profile', checkAuth, profile.main);

app.all('/profile/invite_friend', checkAuth, profile.invite_friend);
app.all('/upload', upload.main);
app.all('/offer', offer.main);
app.all('/offer2', offer2.main);
app.all('/oauth', oauth_route.main);
app.all('/developers', checkAuth, developers.main);
app.all('/developers/app/create', checkAuth, developers.app_create);
app.all('/developers/app/:app_id', checkAuth, developers.app_show);*/

app.all('/add_service/vkontakte', checkAuth, add_service.vk);
app.all('/add_service/twitter', checkAuth, add_service.twitter);
app.all('/add_service/facebook', checkAuth, add_service.facebook);
app.all('/add_service/bitbucket', checkAuth, add_service.bitbucket);
app.all('/add_service/github', checkAuth, add_service.github);
app.all('/add_service/instagram', checkAuth, add_service.instagram);
app.all('/add_service/foursquare', checkAuth, add_service.foursquare);
app.all('/add_service/odnoklassniki', checkAuth, add_service.odnoklassniki);
app.all('/add_service/steam', checkAuth, add_service.steam);
app.all('/add_service/twitch', checkAuth, add_service.twitch);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

function checkAuth(req, res, next) {
  if(!req.session.auth || req.session.auth === false) {
    res.end();
  } else {
    next();
  }
}
