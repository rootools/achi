function sync(param, cb) {
  $.post('/webapi', param, function(data) {
    cb(data);
  }, 'json');
}

$(function(){
	
});