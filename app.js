// Init modules
// Basic Express modules
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var authRoutes = require('./routes/auth');
var webApi = require('./routes/webApi');
var dashboard = require('./routes/dashboard');
var profile = require('./routes/profile');
var add_service = require('./routes/add_service');
var upload = require('./routes/upload');
var offer = require('./routes/offer');

var sessionsStorage = require('connect-redis')(express);

var app = express();
var ECT = require('ect');
var ectRenderer = ECT({ cache: false, watch: false, root: __dirname + '/views' });

app.engine('.ect', ectRenderer.render);

app.configure(function(){
  app.set('port', process.env.PORT || 8001);
  app.set('views', __dirname + '/views');
//  app.set('view engine', 'ect');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ store: new sessionsStorage({db: 7}), secret: 'lolcat' }));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.all('/login', authRoutes.login);
app.all('/logout', authRoutes.logout);
app.all('/webapi', webApi.routing);
app.all('/dashboard', dashboard.main);
app.all('/dashboard/:service', dashboard.service);
app.all('/dashboard/:service/user/:id', dashboard.service_user);
app.all('/dashboard/user/:id', dashboard.user);
app.all('/profile', profile.main);
app.all('/upload', upload.main);
app.all('/offer', offer.main);

app.all('/add_service/vkontakte', add_service.vk);
app.all('/add_service/twitter', add_service.twitter);
app.all('/add_service/facebook', add_service.facebook);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
