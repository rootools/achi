exports.initModels = function(models) {
  var modelsConfig = {
    config: './configs/config',
    users: './models/users',
    achivments: './models/achivments',
    services: './models/services',
    mails: './models/mails',
    db: './models/db',
    files: './models/files'
  };

  var initModels = {};

  for (var i = 0; i < models.length; i++) {
    var name = models[i];
    if (typeof modelsConfig[name] !== 'undefined') {
      initModels[name] = require(modelsConfig[name]);
    } else {
      console.log('Undefined model ' + name);
    }
  }

  return initModels;
};

exports.initModules = function(modules) {
  var initModules = {};

  for (var i = 0; i < modules.length; i++) {
    var name = modules[i];
    initModules[name] = require(name);
  }

  return initModules;
}

//var uploads = require('routes/upload.js');
//var locale = require('configs/locale/main.js');
//var ext_achivster = require('external/achivster.js');