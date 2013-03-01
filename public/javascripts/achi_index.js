$(function() {
	$('.form_menu_buttons').bind('click', function(){
		
		$('.login_form').css('display', 'none');
		$('.register_form').css('display', 'none');
		$('.form_menu_buttons').removeClass('border-color-darken');
		
		if(this.id === 'form_menu_buttons_login'){
			$('.login_form').css('display', 'block');
			$('#form_menu_buttons_login').addClass('border-color-darken');
		}
		
		if(this.id === 'form_menu_buttons_register'){
			$('.register_form').css('display', 'block');
			$('#form_menu_buttons_register').addClass('border-color-darken');
		}
		
	});

	var get = window.location.search.replace( "?", "" ).split('=');
	if(get[0] === 'regkey') {
		var key = get[1];
		$('#register_form').append('<input type="hidden" name="invite_key" value="'+key+'">');
		// Set reg type by default
		$('.login_form').css('display', 'none');
		$('.form_menu_buttons').removeClass('border-color-darken');
		$('.register_form').css('display', 'block');
		$('#form_menu_buttons_register').addClass('border-color-darken');
	}

});

function check_pass(input) {
	if (input.value != document.getElementById('regPass').value) {
    input.setCustomValidity('Пароли не совпадают');
  } else {
    input.setCustomValidity('');
  }
}