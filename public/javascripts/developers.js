$(function() {
  $('.menu_button').bind('click', function() {
    $('div#dev_api').css('display', 'none');
    $('div#dev_app').css('display', 'none');
    if(this.id === 'dev_app') {
      $('div#dev_app').css('display', 'block');
    } else if(this.id === 'dev_api') {
      $('div#dev_api').css('display', 'block');
    }
  });
});