var async = require('async');
var uid = 69445640;
var access_token = '9acbbaaf9ee812a79ee812a7959ec7a49f99ee89ee516b97e044438d91889aa';

getData(access_token, uid, function(data) {
  console.log(data);
});

function getData(access_token, uid, cb) {
  var response = {};

  var vkontakte = require('vkontakte');
  var vk = vkontakte(access_token);

  async.series([
    function(callback) {
      getSingleStat(vk, uid, function(data) {
        callback(null, data);
      });
    },
    function(callback) {
      getMaxPostLike(vk, uid, function(data) {
        callback(null, data);
      });
    }], function(err, data) {
      for(var i=0;i<data.length;i++) {
        for(var key in data[i]) {
          response[key] = data[i][key];
        }
      }
      cb(response);
    });
}

function getSingleStat(vk, uid, cb) {
  var code = 'var friendsCount = API.friends.get().length;';
  code += 'var groupsCount = API.groups.get().length;';
  code += 'var photosCount = API.photos.getAll({no_service_albums:0})[0];';
  code += 'var wallCount = API.wall.get({filter:"owner"})[0];';
  code += 'var audioCount = API.audio.getCount({oid:'+uid+'});';
  code += 'var videoCount = API.video.get()[0];'
  code += 'var response = {friendsCount: friendsCount, groupsCount:groupsCount, photosCount:photosCount, wallCount:wallCount, audioCount:audioCount, videoCount:videoCount};';
  code += 'return response;';

  vk('execute', {code:code}, function(err, data) {
    cb(data);
  });
}

function getMaxPostLike(vk, uid, cb) {
  var dirtyArray = [];
  var maxPostLike = 0;
  vk('wall.get', {count: 100}, function(err, data) {
    dirtyArray.push(data);
    var queue = data[0] / 100;
    queue = queue -(queue%1);
    
    var q = async.queue(function(task, callback) {
      vk('wall.get', task, function(err, data) {
        dirtyArray.push(data)
        callback(data);
      });
    }, queue);

    q.drain = function(data) {
      for(var i=0;i<dirtyArray.length;i++) {
        for(var r=0;r<dirtyArray[i].length;r++) {
          var count = dirtyArray[i][r].likes;
          //STUPID BUG!!!
          for(var key in count) {
            if(count[key] > maxPostLike) { maxPostLike = count[key]; }
          }
        }
      }
      cb({maxPostLike:maxPostLike});
    }

    var handler = 100;
    while(handler < data[0]) {
      q.push({count:100, offset: handler}, function(err,data) { });
      handler = handler + 100;
    }

  });
}
