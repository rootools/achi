$(function() {
  $('.profile_menu_button').bind('click', function() {
    var elem = this.id;
    $('.service_container').fadeOut(200);
    setTimeout(function() {
      showContainer(elem);   
    }, 200);
  });
});

function showContainer(param) {
  if(param === 'services_list') {
    $('#profile_service_container').fadeIn(200);
  }
  if(param === 'friends_list') {
    $('#profile_friends_container').fadeIn(200);
  }
}