$(function() {
  
  // if url = "http://rootools.ru/profile#messages"
  if(document.URL.split('#')[1] === 'messages') {
    showContainer('message_list');
  }
  
  if(document.URL.split('#')[1] === 'friends') {
    showContainer('friends_list');
  }
  if(document.URL.split('#')[1] === 'service') {
    showContainer('services_list');
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
    var oldPass = document.getElementById('input_me_edit_oldPass').value;
    var newPass = document.getElementById('input_me_edit_newPass').value;
    var newPassVerify = document.getElementById('input_me_edit_newPassVerify').value;
    if(url.length > 0) {
      upload_file(url);
    }
    if(name.length > 0) {
      change_name(name);
    }
    if(oldPass.length > 0 && newPass.length > 0 && newPassVerify.length > 0) {
      change_pass(oldPass, newPass, newPassVerify);
    }
  });
  
  $('#button_find_friend').bind('click', function() {
    findUser();  
  });
  
  $('.me_messages_row').bind('click', function() {
    message_list_row_click(this);
  });
  
  $('.friends_list_row').bind('click', function() {
    friends_list_row_click(this);
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
  sync('/webapi', {action: 'find_by_email', email: find_email}, function(response) {
    if(response.error) {
      error_result_field.innerHTML = '';
      error_result_field.innerHTML = '<strong><i class="icon-warning"></i>'+response.error+'</strong>';
    } else {
      error_result_field.innerHTML = '';
      var html = '';
              
      html += '<div class="tile double bg-color-orange search_result">';
      html += ' <div class="tile-content">';
      html += '   <img class="place-left" src="'+response.photo+'" height="64px" id="search_friends_result_photo"></img>';
      html += '   <h3>'+response.name+'</h3>';
      html += '   <h5>Last Achievenment: </h5><p>"'+response.last+'"</p>';
      html += ' </div>';
      html += ' <div class="brand">';
      html += '   <span class="name" id="edit_me_add_friend_search_button"><button class="fg-color-darken add_friend" id="add_friend_'+response.uid+'">Add</button></span>';
      html += '   <span class="badge" id="add_friend_tile_points">'+response.points+'</span>';
      html += ' </div>';
      html += '</div>';
        
      result_field.innerHTML = html;
      $('.add_friend').bind('click', function() {
        var uid = this.id.split('add_friend_')[1];
        sync('/webapi', {action: 'send_friendship_request', uid: uid}, function(response) {
          if(response.error) {
            document.getElementById('add_friend_'+uid).innerHTML = response.error;
            document.getElementById('add_friend_'+uid).disabled = true;
          } else {
            var message = document.getElementById('edit_me_add_friend_search_button');
            $('#edit_me_add_friend_search_button').css('margin-bottom', '14px');
            message.innerHTML = '';
            message.innerHTML = '<h4>'+response.message+'</h4>';
          }
        });
      });
    }
  });
  
  $('#button_clear_find_friend').bind('click', function() {
    error_result_field.innerHTML = '';
    result_field.innerHTML = '';
  });
}

function upload_file(url) {
  if(/^([a-z]([a-z]|\d|\+|-|\.)*):(\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?((\[(|(v[\da-f]{1,}\.(([a-z]|\d|-|\.|_|~)|[!\$&'\(\)\*\+,;=]|:)+))\])|((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=])*)(:\d*)?)(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*|(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)){0})(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url)) {
    sync('/upload', {action: 'upload_profile_photo_from_url', url: url}, function(data) {
      if(data.error) {
        me_edit_error_message(data.error);
        document.getElementById('me_edit_title_photo').setAttribute("class", "fg-color-red");
      } else {
        location.reload();
      }
    });
  } else {
    me_edit_error_message('Invalid image URL', 'me_edit_title_photo');
  }
}

function change_name(name) {
  if(/^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/i.test(name)) {
    sync('/webapi', {action: 'edit_profile_name', name: name}, function(data) {});
  } else {
    me_edit_error_message('Name(only letters and numbers)', 'me_edit_title_name');
  }
}

function change_pass(oldPass, newPass, newPassVerify) {
  if(newPass === newPassVerify) {
    sync('/webapi',{action: 'edit_profile_change_password', oldPass: CryptoJS.MD5(oldPass).toString(), newPass: CryptoJS.MD5(newPass).toString()}, function(response) {
      if(response.error) {
        me_edit_error_message(response.error, 'me_edit_change_password');
      } else {
        me_edit_error_message('Pass updated', 'me_edit_change_password');
      }
    });
  } else {
    me_edit_error_message('Passwords didn`t match', 'me_edit_title_photo');
  }
}

function me_edit_error_message(message, head) {
  var me_edit_info = document.getElementById('me_edit_info');
  var html = '<strong class="fg-color-red"><i class="icon-warning"></i>'+message+'</strong>';
  me_edit_info.innerHTML = '';
  me_edit_info.innerHTML = html;
  document.getElementById(head).setAttribute("class", "fg-color-red");
}

function message_list_row_click(elem) {
  var flag = $(elem).next().attr('class');
  if(flag === undefined || flag !== 'centered') {
    var html = '';
    var type = $(elem).attr('class').split(' ')[1].split('me_messages_')[1];
    if(type === 'friendship_request') {
      html = '<tr class="centered"><td colspan="4"><button class="me_messages_action_button" value="accept">Accept</button><button class="me_messages_action_button" value="reject">Reject</button></td>';
    }
    $(elem).after(html);
    set_message_list_action();
  } else {
    $(elem).next().remove();
  }
}

function set_message_list_action() {
  $('.me_messages_action_button').bind('click', function() {
    var message_id = $(this).parent().parent().prev();
    message_id = $(message_id).attr('id');
    var owner_uid = message_id.split('_');
    var target_uid = owner_uid[1];
    owner_uid = owner_uid[0];
    var button_action = this.value;
    sync('webapi', {action: 'friendship_accept_or_reject', command: button_action, owner_uid: owner_uid, target_uid: target_uid}, function(response) {
      var message_row = $('#'+message_id);
      $(message_row).next().remove();
      $(message_row).remove();
      $('#friends_list').bind('click', function() {
        location = '/profile#friends';
        location.reload();
      });
    });
  });
}

function friends_list_row_click(elem) {
  var flag = $(elem).next().attr('class');
  var friends_uid = elem.id;
  if(flag === undefined || flag.split(' ')[1] !== 'friends_list_row_action') {
    var html = '<div class="row friends_list_row_action"><button class="friends_list_row_action_button" value="profile">Profile</button><button class="friends_list_row_action_button" value="remove">Remove</button></div>';
    $(elem).after(html);
    set_friends_list_action(friends_uid);
  } else {
    $(elem).next().remove();
  }
}

function set_friends_list_action(friends_uid) {
  $('.friends_list_row_action_button').bind('click', function() {
    var action_panel = this;
    var value = this.value;
    if(value === 'remove') {
      sync('webapi', {action: 'remove_friendship', friends_uid: friends_uid}, function(response) {
        var name = $('#'+friends_uid).children('.friends_list_name').text();
        $('#'+friends_uid).css('display','none');
        var html = '<button class="friends_list_row_action_button friends_list_row_action_restore_button" value="restore">Restore</button> Restore friendship with '+name;
        $(action_panel).parent().html(html);
        restore_friend_set_event();
      });
    }
    if(value === 'profile') {
      document.location.href = 'http://'+location.host+'/dashboard/user/'+friends_uid;
    }
  });
}

function restore_friend_set_event() {
  $('.friends_list_row_action_restore_button').bind('click', function(){
    var friend_elem = $(this).parent().prev();
    var friends_uid = $(friend_elem).attr('id');
    sync('webapi',{action: 'restore_friendship', friends_uid: friends_uid}, function(response) {
      $(friend_elem).css('display','block');
      $(friend_elem).next().remove();  
    });
  });
}