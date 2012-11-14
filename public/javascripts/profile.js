function sync(data, cb) {
  $.post('upload', data, function(data, status, jqXHR) {
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
      sync({action: 'upload_profile_photo_from_url', url: url}, function(data) {
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