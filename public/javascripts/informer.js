function sync(path, data, cb) {
  $.post(path, data, function(data, status, jqXHR) {
    cb(JSON.parse(jqXHR.responseText));
  });
}

$(function() {
  sync('webapi', {action: 'get_new_notifications'}, function(response) {
    console.log(response);
    var notifications = document.getElementById('notifications');
    notifications.innerHTML = '';
    if(response > 0) {
      var html = '';
      
      html += '<a href="/profile#messages" id="profile_messages"><span class="fg-color-red"><i class="icon-mail"></i>'+response+'</span></a>';
      notifications.innerHTML = html;
      $('#profile_messages').bind('click', function() {
        location.reload();
      });
    }
  });
});