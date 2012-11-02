function sync(data, cb) {
  data = {loginEmail: 'baboonweb@gmail.com', loginPass: 1};
  $.post('login', data, function(data, status, jqXHR) {
    cb(JSON.parse(jqXHR.responseText));
  });
}

$(function() {

  $('.login-or-reg').click(function() {
    var formZone = document.getElementById('login-form');
    formZone.innerHTML = '';
    var html = '';
    if(this.id == 'login') {
//      html += '<form class="loginForm" method="POST">';
      html += '  <div class="input-control text">';
      html += '    <input type="email" class="loginForm" name="loginEmail" placeholder="E-mail">';
      html += '  </div>';
      html += '  <div class="input-control password">';
      html += '    <input type="password" class="loginForm" name="loginPass" placeholder="Password">';
      html += '  </div>';
      html += '  <center><button id="loginFormSubmitButton">Submit</center>';
//      html += '</form>';
    }
    if(this.id == 'register') {
      html += '<form class="loginForm" method="POST">';
      html += '  <div class="input-control text">';
      html += '    <input type="email" class="loginForm" name="regEmail" placeholder="E-mail">';
      html += '  </div>';
      html += '  <div class="input-control password">';
      html += '    <input type="password" class="loginForm" name="regPass" placeholder="Password">';
      html += '  </div>';
      html += '  <div class="input-control password">';
      html += '    <input type="password" class="loginForm" name="regPassVerify" placeholder="Password veruify">';
      html += '  </div>';
      html += '  <center><input type="submit" value="Submit" id="loginFormSubmitButton"></center>';
      html += '</form>';
    }
    formZone.innerHTML = html;
    $('#loginFormSubmitButton').click(function() {
      sync('', function(response){
        if(response.error) {
          var error_show = document.getElementById('error_show');
          error_show.innerHTML = '';
          error_show.innerHTML = '<strong class="fg-color-red">'+response.error+'</strong>';
        }
      });
    });
  });

  $('.close-error-button').click(function() {
    $('.error-bar').remove();
  });
  
});

