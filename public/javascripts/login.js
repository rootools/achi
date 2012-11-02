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
      html += '  <input type="submit" value="Submit" id="loginFormSubmitButton">';
      html += '</form>';
    }
    formZone.innerHTML = html;
  });

});

