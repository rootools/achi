exports.options = function(auth) {
  return {
    host: 'localhost',
    port: 8065,
    path: '/?oauth_token='+auth.oauth_token+'&oauth_token_secret='+auth.oauth_token_secret
  };
};

exports.functions = {

  // Write 10 tweets
  '0OeqcxuY778XB5fHDJPRlk2EwWzFLd': function(data) {
    return data.statuses_count >= 10;
  },

  // Write 100 tweets
  'w89OmGa81LGju9cxd2ilNtce755PBb': function(data) {
    return data.statuses_count >= 100;
  },

  // Write 1000 tweets
  'KPrphso661IztHM4OYqi5Zb0IBSYZ6': function(data) {
    return data.statuses_count >= 1000;
  },

  // Write 5000 tweets
  'rr0vF2Bn6a5vUbzHM8rAXDPFJSn4CN': function(data) {
    return data.statuses_count >= 5000;
  },

  // Write 10000 tweets
  '9uNB3eic259fYtH1fW9UjN4hZA7vRE': function(data) {
    return data.statuses_count >= 10000;
  },

  // Earn 5 Followers
  'IAT0dpCbKoHDSMIL1w1I36WZDijqCT': function(data) {
    return data.followers_count >= 5;
  },

  // Earn 50 Followers
  'Y1Ra9C8EzDuOmg0YcpJNh8Wx5kM4fb': function(data) {
    return data.followers_count >= 50;
  },

  // Earn 100 Followers
  'fefK09G9al1in69GhGVqqeXmY19tCx': function(data) {
    return data.followers_count >= 100;
  },

  // Add 10 Friends
  'uXi2CRNFJzxZShZOnveug3B9WCVeed': function(data) {
    return data.friends_count >= 10;
  },

  // Add 50 Friends
  'pySzJCgThCYghDuqPJrpT9CaNFxZng': function(data) {
    return data.friends_count >= 50;
  },

  // Add 100 Friends
  'DOWVEg0x4koMUZGkFDt2StIKUvkdTZ': function(data) {
    return data.friends_count >= 100;
  },

  '1B7Hkwb4qOVKnOGuHr6qJTHONwalsu': function(data) {
    return data.is_achivster === true;
  }

};