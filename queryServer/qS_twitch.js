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
  },
  
  // Follow 5 people
  'x8Cn4j5IedzQ4b3niDtzhXp5O7dZ5V': function(data) {
    return data.follows >= 5;
  },
  
  // Follow 10 people
  'tC4e6NaTtFJ0sW51vHRPbpMHZBqPAp': function(data) {
    return data.follows >= 10;
  },
  
  // Follow 25 people
  'vGeiV7fK2Om2TskxdjxfyYHpoA2ZvR': function(data) {
    return data.follows >= 25;
  }
};
