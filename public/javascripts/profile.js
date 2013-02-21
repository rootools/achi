$(function() {
  
  // if url = "http://rootools.ru/profile#messages"
  if(document.URL.split('#')[1] === 'messages') {
    showContainer('message_list');
  }
  
  if(document.URL.split('#')[1] === 'friends') {
    showContainer('friends_list');
  }
  
  $('.profile_menu_button').bind('click', function() {
    var elem = this.id;
    $('.service_container').fadeOut(200);
    setTimeout(function() {
      showContainer(elem);   
    }, 200);
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

function check_pass(input) {
  if (input.value != document.getElementById('input_me_edit_newPass').value) {
    input.setCustomValidity('Пароли не совпадают');
  } else {
    input.setCustomValidity('');
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