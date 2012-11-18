function sync(path, data, cb) {
  $.post(path, data, function(data, status, jqXHR) {
    cb(JSON.parse(jqXHR.responseText));
  });
}