$(function() {
  $('#friends_top_button').bind('click', function() {
    $('.top_content').fadeOut(200);
    setTimeout(function() {
      $('#top_friends_list').css('display','block');
      $('#top_world_list').css('display','none');
      $('.top_content').fadeIn(200);
    }, 200);
  });
  
  $('#world_top_button').bind('click', function() {
    $('.top_content').fadeOut(200);
    setTimeout(function() {
      $('#top_world_list').css('display','block');
      $('#top_friends_list').css('display','none');
      $('.top_content').fadeIn(200);
    }, 200);
  });
});