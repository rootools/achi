function sync(data, cb) {
  $.post('login', data, function(data, status, jqXHR) {
    cb(JSON.parse(jqXHR.responseText));
  });
}

$(function() {
  var error_show = document.getElementById('error_show');
  
  $('.login-or-reg').click(function() {
    $('#error_show').fadeOut(100);
    $('#login-form').fadeOut(200);
    error_show.innerHTML = '';
    var formZone = document.getElementById('login-form');
    formZone.innerHTML = '';
    var html = '';
    if(this.id == 'login') {
      html += '  <div class="input-control text">';
      html += '    <input type="email" class="loginForm" id="loginEmail" placeholder="E-mail">';
      html += '  </div>';
      html += '  <div class="input-control password">';
      html += '    <input type="password" class="loginForm" id="loginPass" placeholder="Password">';
      html += '  </div>';
      html += '  <center><button id="loginFormSubmitButton" value="login">Submit</button></center>';
    }
    if(this.id == 'register') {
      html += '  <div class="input-control text">';
      html += '    <input type="email" class="loginForm" id="regEmail" placeholder="E-mail">';
      html += '  </div>';
      html += '  <div class="input-control password">';
      html += '    <input type="password" class="loginForm" id="regPass" placeholder="Password">';
      html += '  </div>';
      html += '  <div class="input-control password">';
      html += '    <input type="password" class="loginForm" id="regPassVerify" placeholder="Password veruify">';
      html += '  </div>';
      html += '  <center><button value="reg" id="loginFormSubmitButton">Submit</button></center>';
    }
    formZone.innerHTML = html;
    $('#login-form').fadeIn(200);
    $('#loginFormSubmitButton').click(function() {
      var flag = false;
      var error = '';
      var action = document.getElementById('loginFormSubmitButton').value;
      if(action === 'login') {
        var email = document.getElementById('loginEmail').value;
        var pass = document.getElementById('loginPass').value;
        flag = true;
      }
      if(action === 'reg') {
        var email = document.getElementById('regEmail').value;
        var pass = document.getElementById('regPass').value;
        var passVerify = document.getElementById('regPassVerify').value;
        if(pass === passVerify) {
          flag = true;
        } else {
          error = 'Passwords didn`t match';
        }
      }
      if(flag === true) {
        sync({action: action, email: email, pass: pass}, function(response){
          if(response.error) {
            error_show.innerHTML = '';
            $('#error_show').fadeOut(300);
            error_show.innerHTML = '<strong class="fg-color-red">'+response.error+'</strong>';
            $('#error_show').fadeIn(300);
          } else {
            location.reload();
          }
        });
      } else {
        error_show.innerHTML = '';
        $('#error_show').hide(300);
        error_show.innerHTML = '<strong class="fg-color-red">'+error+'</strong>';
        $('#error_show').show(300);
      }
    });
  });

});

