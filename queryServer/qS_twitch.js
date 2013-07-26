exports.options = function(auth) {
  return {
    host: 'localhost',
    port: 8105,
    path: '/?access_token='+auth.access_token
  }
};

exports.functions = {

  // Record 5 video
  'ANwyV20JZrsPdMABno3gLlHSdFPU5c': function(data) {
    return data.videos_count >= 5;
  }
};
