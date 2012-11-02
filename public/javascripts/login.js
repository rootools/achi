$(function() {

  $('.login-or-reg').click(function() {
    var formZone = document.getElementById('login-form');
    formZone.innerHTML = '';
    var html = '';
    if(this.id == 'login') {
      html += '<form class="loginForm" method="POST" action="/login">';
      html += '  <div class="input-control text">';
      html += '    <input type="email" class="loginForm" name="loginEmail" placeholder="E-mail">';
      html += '  </div>';
      html += '  <div class="input-control password">';
      html += '    <input type="password" class="loginForm" name="loginPass" placeholder="Password">';
      html += '  </div>';
      html += '  <center><input type="submit" value="Submit" id="loginFormSubmitButton"></center>';
      html += '</form>';
    }
    if(this.id == 'register') {
      html += '<form class="loginForm" method="POST" action="/login">';
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
  });

  $('.close-error-button').click(function() {
    $('.error-bar').remove();
  });
  
});

