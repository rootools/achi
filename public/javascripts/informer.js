$(function() {
  
  sync('/webapi', {action: 'get_new_notifications'}, function(response) {
    var notifications = document.getElementById('notifications');
    notifications.innerHTML = '';
    if(response > 0) {
      var html = '';
      
      html += '<a href="/profile#messages" id="profile_messages"><span class="fg-color-red"><i class="icon-mail"></i>'+response+'</span></a>';
      notifications.innerHTML = html;
      $('#profile_messages').bind('click', function() {
        if(location.pathname === '/profile') {
          location = '/profile#messages';
          location.reload();
        } else {
          document.location.replace('/profile#messages');
        }
      });
    }
  });
});