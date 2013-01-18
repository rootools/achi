var http = require('http');
var util = require('util');
var url = require('url');

var async = require('async');

http.createServer(function (req, res) {
  var query = url.parse(req.url, true).query;
  getData(query.access_token, query.uid, function(data) {
    console.log(data);
    res.end(JSON.stringify(data));
  });
}).listen(process.env.VCAP_APP_PORT || 8085);


function getData(access_token, uid, cb) {
  var response = {};

  var vkontakte = require('vkontakte');
  var vk = vkontakte(access_token);

  async.series([
    function(callback) {
      getSingleStat(vk, uid, function(err, data) {
        if(err) {
          callback(err, null);
        } else {
          data.audioCount = parseFloat(data.audioCount);
          callback(null, data);
        }
      });
    },
    function(callback) {
      getMaxLike('wall.get', {count:100}, vk, uid, function(data) {
        callback(null, data);
      });
    },
    function(callback) {
      getMaxLike('photos.getAll', {count:100, extended:1}, vk, uid, function(data) {
        callback(null, data);
      });
    }], function(err, data) {
      if(err) {
        cb({error: 1});
      } else {
        for(var i=0;i<data.length;i++) {
          for(var key in data[i]) {
            response[key] = data[i][key];
          }
        }
        cb(response);
      }
    });
}

function getSingleStat(vk, uid, cb) {
  var code = 'var friendsCount = API.friends.get().length;';
  code += 'var groupsCount = API.groups.get().length;';
  code += 'var photosCount = API.photos.getAll({no_service_albums:0})[0];';
  code += 'var wallCount = API.wall.get()[0];';
  code += 'var audioCount = API.audio.getCount({oid:'+uid+'});';
  code += 'var videoCount = API.video.get()[0];';
  code += 'var isAchivster = API.group.isMember({gid: achivster});';
  code += 'var response = {friendsCount: friendsCount, groupsCount:groupsCount, photosCount:photosCount, wallCount:wallCount, audioCount:audioCount, videoCount:videoCount, isAchivster: isAchivster};';
  code += 'return response;';

  vk('execute', {code:code}, function(err, data) {
    cb(err, data);
  });
}

function getMaxLike(method, options, vk, uid, cb) {
  if(method == 'photos.getAll') {
    var name_cb = 'maxPhotoLike';
  }
  if(method == 'wall.get') {
    var name_cb = 'maxPostLike';
  }

  var dirtyArray = [];
  var cb_obj = {};
  vk(method, options, function(err, data) {
    dirtyArray.push(data);
    var queue = data[0] / 100;
    queue = queue -(queue%1);
    if(queue < 1) {
      cb_obj[name_cb] = calcMaxLike(dirtyArray);
      cb(cb_obj);
    }

    var q = async.queue(function(task, callback) {
      vk(method, task, function(err, data) {
        dirtyArray.push(data);
        callback(data);
      });
    }, queue);

    q.drain = function(data) {
      cb_obj[name_cb] = calcMaxLike(dirtyArray);
      cb(cb_obj);
    };

    var handler = 100;
    while(handler < data[0]) {
      options.offset = handler;
      q.push(options, function(err,data) {});
      handler = handler + 100;
    }

    function calcMaxLike(array) {
      var maxLike = 0;

      for(var i=0;i<array.length;i++) {
        for(var r=0;r<array[i].length;r++) {
          var count = array[i][r].likes;
          //STUPID BUG!!!
          for(var key in count) {
            if(count[key] > maxLike) { maxLike = count[key]; }
          }
        }
      }
      return maxLike;
    }

  });

}
