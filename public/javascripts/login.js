$(function() {
  var login_zone = document.getElementById('login_zone');
  $('.login_or_register').click(function() {
    $('#login_zone').fadeOut(200);
    var html = '';
    if(this.id == 'login') {
      html += '  <div id="error_show"></div>';
      html += '  <div class="input-control text">';
      html += '    <input type="email" class="loginForm" id="loginEmail" placeholder="E-mail">';
      html += '  </div>';
      html += '  <div class="input-control password">';
      html += '    <input type="password" class="loginForm" id="loginPass" placeholder="Password">';
      html += '  </div>';
      html += '  <center><button id="loginFormSubmitButton" value="login">Submit</button>';
      html += '  <button id="closeFormButton">Close</button></center>';
    }
    if(this.id == 'register') {
      html += '  <div id="error_show"></div>';
      html += '  <div class="input-control text">';
      html += '    <input type="email" class="loginForm" id="regEmail" placeholder="E-mail">';
      html += '  </div>';
      html += '  <div class="input-control password">';
      html += '    <input type="password" class="loginForm" id="regPass" placeholder="Password">';
      html += '  </div>';
      html += '  <div class="input-control password">';
      html += '    <input type="password" class="loginForm" id="regPassVerify" placeholder="Password verify">';
      html += '  </div>';
      html += '  <center><button value="reg" id="loginFormSubmitButton">Submit</button>';
      html += '  <button id="closeFormButton">Close</button></center>';
    }
    setTimeout(function() {
      login_zone.innerHTML = html;
      $('#login_zone').fadeIn(200);
      setSubmitButton();
      setCloseButton();
      setEnterPush();
    }, 200);
    
  });
});

function setCloseButton() {
  var login_zone = document.getElementById('login_zone');
  $('#closeFormButton').click(function() {
    login_zone.innerHTML = '';
    $('#login_zone').fadeOut(1);
  });
}

function setSubmitButton() {
  $('#loginFormSubmitButton').click(function() {
    submitAction();
  });
}

function setEnterPush() {
  $('.loginForm').keyup(function(e) {
    if(testInputContents()) {
      if(e.charCode === 13) {
        submitAction();
      }
      if(e.keyCode === 13) {
        submitAction();
      }
    }
  });
}

// Test all Login/Registration Field to not null content.
// Return True only if all 2 or 3 input is not null
function testInputContents() {
  var loginEmail = document.getElementById('loginEmail');
  var loginPass = document.getElementById('loginPass');
  var regEmail = document.getElementById('regEmail');
  var regPass = document.getElementById('regPass');
  var regPassVerify = document.getElementById('regPassVerify');
  if(loginEmail !== null && loginPass !== null) {
    if(loginEmail.value.length !== 0 && loginPass.value.length !== 0) {
      return true;
    } else {
      return false;
    }
  }
  if(regEmail !== null && regPass !== null && regPassVerify !== null) {
    if(regEmail.value.length !== 0 && regPass.value.length !== 0 && regPassVerify.value.length !== 0) {
      return true;
    } else {
      return false;
    }
  }
  return false;
}

function submitAction() {
  var error_show = document.getElementById('error_show');

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
    sync('login', {action: action, email: email, pass: pass}, function(response){
      if(response.error) {
        $('#error_show').fadeOut(200);
        setTimeout(function() {
          error_show.innerHTML = '';
          error_show.innerHTML = '<strong class="fg-color-red"><i class="icon-warning"></i>'+response.error+'</strong>';
          $('#error_show').fadeIn(200);
        }, 200);
      } else {
        location.reload();
      }
    });
  } else {
    $('#error_show').fadeOut(200);
    error_show.innerHTML = '<strong class="fg-color-red"><i class="icon-warning"></i>'+error+'</strong>';
    setTimeout(function() {
      error_show.innerHTML = '';
      $('#error_show').fadeIn(200);
    }, 200);
  }
}