var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();
var ECT = require('ect');
var ectRenderer = ECT({ cache: false, watch: false, root: __dirname + '/views' });

app.engine('.ect', ectRenderer.render);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

app.all('/editor_api', routes.editor_api);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
