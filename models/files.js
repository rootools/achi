var init = require('../init.js');
var app = init.initModels(['config']);
var mod = init.initModules(['fs', 'easyimg', 'url', 'http', 'extend']);

//upload_profile_photo_from_url
exports.downloadFromUrl = function (url, path, cb) {
  var upload_path, file_name, file, options;

  options = {
    host: mod.url.parse(url).host,
    port: 80,
    path: mod.url.parse(url).pathname
  };
  
  file_name = mod.url.parse(url).pathname.split('/').pop();

  upload_path = app.config.dirs.uploads+file_name;
  path = path ? path : upload_path;

  file = mod.fs.createWriteStream(upload_path);
  
  mod.http.get(options, function(res) {
    res.on('data', function(data) {
      file.write(data);
    });
    
    res.on('end', function() {
      file.end();

      mod.fs.rename(upload_path, path, function() {
        cb({path: path});
      });

    });
  
  });
}

//convertImage (Part1)
exports.convertImage = function (params, cb) {
  if (params.path == undefined && params.src == undefined) {
    return false;
  }

  var defaultParams = {
    src: params.src || params.path,
    dst: params.dst || params.src || params.path,
    quality: 90
  };
  params = mod.extend({}, defaultParams, params);

  mod.easyimg.convert(params, function(err, stdout, stderr) {
    return cb(params);
  });
}

//convertImage (Part2)
exports.createThumbnail = function (params, cb) {
  if (params.path == undefined && params.src == undefined) {
    return false;
  }

  var defaultParams = {
    src: params.src || params.path,
    dst: params.dst || params.src || params.path,
    width: 194,
    height: 194,
    fill: true
  };
  params = mod.extend({}, defaultParams, params);

  mod.easyimg.thumbnail(params, function(err, stdout, stderr) {
    return cb(params);
  });
}