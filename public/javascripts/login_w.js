var login_chooser = document.getElementById('login_chooser');
var reg_chooser = document.getElementById('reg_chooser');

login_chooser.onclick = function(e) {
  setLoginChooser();
};

reg_chooser.onclick = function(e) {
  setRegisterChooser();
};

function setLoginChooser() {
  clearError();
  login_chooser.className = 'chooser chooser_selected';
  reg_chooser.className = 'chooser';
  var form = document.getElementById('login_or_reg_form');
  var html = '<input type="text" placeholder="E-mail" name="email" required>' +
             '<input type="password" placeholder="Пароль" name="pass" required>' +
             '<input type="submit" id="login_button_login" value="Войти">' +
             '<input type="hidden" name="action" value="login">' +
             '<span id="login_recover_link"><a href="/">Забыли пароль?</a></span>';

  form.innerHTML = html;
}

function setRegisterChooser() {
  clearError();
  reg_chooser.className = 'chooser chooser_selected';
  login_chooser.className = 'chooser';
  var form = document.getElementById('login_or_reg_form');
  var html = '<input type="text" placeholder="E-mail" name="email" required>' +
             '<input type="password" placeholder="Пароль" name="pass" required id="regPass">' +
             '<input type="password" placeholder="Еще раз пароль" oninput="check_pass(this)" required>' +
             '<input type="hidden" name="action" value="reg">' +
             '<input type="submit" id="login_button_reg" value="Зарегистрироваться">';

  form.innerHTML = html;
}

function clearError() {
  var error = document.getElementById('login_error');
  if(error) {
    error.innerHTML = ''
  }  
}

function check_pass(input) {
  if (input.value != document.getElementById('regPass').value) {
    input.setCustomValidity('Пароли не совпадают');
  } else {
    input.setCustomValidity('');
  }
}