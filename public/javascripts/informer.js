function sync(path, data, cb) {
  $.post(path, data, function(data, status, jqXHR) {
    cb(JSON.parse(jqXHR.responseText));
  });
}

$(function() {
    sync('webapi', {action: 'get_new_notifications'}, function(response) {
      var notifications = document.getElementById('notifications');
      notifications.innerHTML = '';
      if(response.notice > 0) {
        var html = '';
        
        html += '<a href="/profile#messages" class="fg-color-red" id="profile_messages"><i class="icon-mail"></i>'+response.notice+'</a>';
        notifications.innerHTML = html;
        $('#profile_messages').bind('click', function() {
          location.reload();
        });
      }
    });
});