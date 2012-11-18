$(function() {
  
  // if url = "http://rootools.ru/profile#messages"
  if(document.URL.split('#')[1] === 'messages') {
    showContainer('message_list');
  }
  
  $('.profile_menu_button').bind('click', function() {
    var elem = this.id;
    $('.service_container').fadeOut(200);
    setTimeout(function() {
      showContainer(elem);   
    }, 200);
  });
  
  $('#me_edit_submit').bind('click', function() {
    var url = document.getElementById('input_me_edit_image_url').value;
    var name = document.getElementById('input_me_edit_name').value;
    if(url.length > 0) {
      upload_file();
    }
    if(name.length > 0) {
      change_name();
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
  if(param === 'message_list') {
    $('#profile_me_messages').fadeIn(200);
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
        html += '   <h3>'+response.name+'</h3>';
        html += '   <h5>Last Achievenment: </h5><p>"'+response.last+'"</p>';
        html += ' </div>';
        html += ' <div class="brand">';
        html += '   <span class="name"><button class="fg-color-darken add_friend" id="add_friend_'+response.uid+'">Add</button></span>';
        html += '   <span class="badge" id="add_friend_tile_points">'+response.points+'</span>';
        html += ' </div>';
        html += '</div>';
        
        result_field.innerHTML = html;
        $('.add_friend').bind('click', function() {
          var uid = this.id.split('add_friend_')[1];
          sync('webapi', {action: 'send_friendship_request', uid: uid}, function(response) {
            if(response.error) {
              document.getElementById('add_friend_'+uid).innerHTML = response.error;
              document.getElementById('add_friend_'+uid).disabled = true;
            } 
          });
        });
      });
    }
  });
  
  $('#button_clear_find_friend').bind('click', function() {
    error_result_field.innerHTML = '';
    result_field.innerHTML = '';
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
      $('#profile_me_photo').fadeIn(100);
    }
  });
}

function upload_file() {
  var url = document.getElementById('input_me_edit_image_url').value;
  var me_edit_info = document.getElementById('me_edit_info');
  if(/^([a-z]([a-z]|\d|\+|-|\.)*):(\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?((\[(|(v[\da-f]{1,}\.(([a-z]|\d|-|\.|_|~)|[!\$&'\(\)\*\+,;=]|:)+))\])|((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=])*)(:\d*)?)(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*|(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)){0})(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url)) {
    console.log(url);
    sync('upload', {action: 'upload_profile_photo_from_url', url: url}, function(data) {
      if(data.error) {
        var message = '<strong class="fg-color-red"><i class="icon-warning"></i>'+data.error+'</strong>';
        document.getElementById('me_edit_title_photo').setAttribute("class", "fg-color-red");
        me_edit_info.innerHTML = '';
        me_edit_info.innerHTML = message;
      } else {
        location.reload();
      }
    });
  } else {
    var message = '<strong class="fg-color-red"><i class="icon-warning"></i>Invalid image URL</strong>';
    document.getElementById('me_edit_title_photo').setAttribute("class", "fg-color-red");
    me_edit_info.innerHTML = '';
    me_edit_info.innerHTML = message;
  }
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

function change_name() {
  var me_edit_info = document.getElementById('me_edit_info');
  var name = document.getElementById('input_me_edit_name').value;
  if(/^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/i.test(name)) {
    sync('webapi', {action: 'edit_profile_name', name: name}, function(data) {
      //return;
    });
  } else {
    var message = '<strong class="fg-color-red"><i class="icon-warning"></i>Invalid Name(only letters and numbers)</strong>';
    document.getElementById('me_edit_title_name').setAttribute("class", "fg-color-red");
    me_edit_info.innerHTML = '';
    me_edit_info.innerHTML = message;
    return;
  }
}