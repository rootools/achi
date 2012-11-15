function sync(path, data, cb) {
  $.post(path, data, function(data, status, jqXHR) {
    cb(JSON.parse(jqXHR.responseText));
  });
}


$(function() {
  
  $('.profile_menu_button').bind('click', function() {
    var elem = this.id;
    $('.service_container').fadeOut(200);
    setTimeout(function() {
      showContainer(elem);   
    }, 200);
  });
  
  $('#upload_file').bind('click', function() {
    var url = document.getElementById('input_me_edit_image_url').value;
    var process_info = document.getElementById('process_info');
    if(/^([a-z]([a-z]|\d|\+|-|\.)*):(\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?((\[(|(v[\da-f]{1,}\.(([a-z]|\d|-|\.|_|~)|[!\$&'\(\)\*\+,;=]|:)+))\])|((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=])*)(:\d*)?)(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*|(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)){0})(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url)) {
      process_info.innerHTML = '';
      process_info.innerHTML = '<strong class="fg-color-green"><i class="icon-warning"></i>Image processing...</strong>';
      sync('upload', {action: 'upload_profile_photo_from_url', url: url}, function(data) {
        if(data.error) {
          var message = '<strong class="fg-color-red"><i class="icon-warning"></i>'+data.error+'</strong>';
          process_info.innerHTML = '';
          process_info.innerHTML = message;
        } else {
          location.reload();
        }
      });
    } else {
      var message = '<strong class="fg-color-red"><i class="icon-warning"></i>Invalid URL</strong>';
      process_info.innerHTML = '';
      process_info.innerHTML = message;
    }
  });
  
  $('#button_find_friend').bind('click', function() {
    findUser();  
  });
});

function showContainer(param) {
  if(param === 'services_list') {
    $('#profile_service_container').fadeIn(200);
  }
  if(param === 'friends_list') {
    $('#profile_friends_container').fadeIn(200);
  }
  if(param === 'me_edit') {
    $('#profile_me_edit_container').fadeIn(200);    
  }
}

function findUser() {
  var find_email = document.getElementById('input_find_friend').value;
  var error_result_field = document.getElementById('error_search_friends_result');
  var result_field = document.getElementById('search_friends_result');
  sync('webapi', {action: 'find_by_email', email: find_email}, function(response) {
    console.log(response);
    if(response.error) {
      error_result_field.innerHTML = '';
      error_result_field.innerHTML = '<strong><i class="icon-warning"></i>'+response.error+'</strong>';
    } else {
      error_result_field.innerHTML = '';
      testImage(response.uid, function(flag) {
        var img_url;
        var html = '';
        if(flag === true) {
          img_url = '/images/users_photo/'+response.uid+'.jpg';
        } else {
          img_url = '/images/label.png';
        }
        
        html += '<div class="tile double bg-color-orange search_result">';
        html += ' <div class="tile-content">';
        html += '   <img class="place-left" src="'+img_url+'" height="64px" id="search_friends_result_photo"></img>';
        html += '   <h3>Bravin Anton</h3>';
        html += '   <h5>Last Achievenment: </h5><p>"'+response.last+'"</p>';
        html += ' </div>';
        html += ' <div class="brand">';
        html += '   <span class="name"><button class="fg-color-darken">Add</button></span>';
        //html += '   <span class="name"><i class="icon-plus"></i>Add</span>';
        html += '   <span class="badge" id="add_friend_tile_points">'+response.points+'</span>';
        html += ' </div>';
        html += '</div>';
        
        result_field.innerHTML = html;
      });
    }
  });
}
function change_img(uid) {
  var img = document.getElementById('user_photo');
  
  if(img.src === 'http://'+document.domain+'/images/users_photo/'+uid+'.jpg') {
    return;
  }
  
  testImage(uid, function(flag) {
    if(flag === true) {
      var img = document.getElementById('user_photo');
      img.src = '/images/users_photo/'+uid+'.jpg';
    }
  });
}

function testImage(uid, cb) {
  var http = new XMLHttpRequest();
  http.open('HEAD', '/images/users_photo/'+uid+'.jpg');
  
  http.onload = function() {
    if (this.status === 200) {
      cb(true);
    } else {
      cb(false);
    }
  };
  
  http.send();
}