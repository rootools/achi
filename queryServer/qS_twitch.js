exports.options = function(auth) {
  return {
    host: 'localhost',
    port: 8105,
    path: '/?access_token='+auth.access_token
  };
};

exports.functions = {

  // Record 1 video
  'jeeikuOtu01uWGPVEeY34955m0Tkbo': function(data) {
    return data.videos_count >= 1;
  },
  
  // Record 5 video
  'ANwyV20JZrsPdMABno3gLlHSdFPU5c': function(data) {
    return data.videos_count >= 5;
  },
  
  // Record 25 video
  'sK84maFF1Fq6MepEQozMPJKBkGdLN9': function(data) {
    return data.videos_count >= 25;
  },
  
  // Record 50 video
  'YoOim4OQs1cDlKCIpqGkli2LiAagep': function(data) {
    return data.videos_count >= 50;
  },
  
  // Record 100 video
  'BRmiMapQGE4MfzclUst9BaFOBTe7xK': function(data) {
    return data.videos_count >= 100;
  }
};
