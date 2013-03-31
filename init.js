exports.require = function(modules) {
  var models = {
    config: './configs/config',
    users: './models/users',
    achivments: './models/achivments',
    db: './models/db'
  };

  var app = {};
  var init = this;

  for (name in modules) {
    if (typeof models[name] !== 'undefined') {
      app[name] = require(models[name]);
    } else {
      app[name] = require(name);
    }
  }
};

//var uploads = require('routes/upload.js');

//var locale = require('configs/locale/main.js');
//var ext_achivster = require('external/achivster.js');