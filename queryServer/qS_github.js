exports.options = function(auth) {
  return {
    host: 'localhost',
    port: 8045,
    path: '/?token='+auth.access_token
  };
};

exports.functions = {

  // Add 1 repo
  'Bb0xWaW1sTGO2aaGCjP0GkVue66cOJ': function(data) {
    return data.repo_count >= 1;
  },

  // Add 5 repo
  'XkP1262wBefye6AG4aNnJ04Ns9Drif': function(data) {
    return data.repo_count >= 5;
  },

  // Add 10 repo
  '0s4i0xA0C3MVnqqa4TG9Pgfm7D9GYX': function(data) {
    return data.repo_count >= 10;
  },

  // Add 30 repo
  'DOMXlqpQg1q3HbVgeC9Hc0Bpz5nxVM': function(data) {
    return data.repo_count >= 30;
  },

  // Add 50 repo
  'PmollXjNoOzEp0F9JZOVoTKiOsCxQW': function(data) {
    return data.repo_count >= 50;
  },

  // have wiki
  'UQ3sqcJYB5FNWF5lM1MrPyNgHJnH6a': function(data) {
    return data.have_wiki === true;
  },

  // have issues
  'W76fUOKzhKQXSvCkodHS44K8I8Tw8f': function(data) {
    return data.have_issues === true;
  },

  // Add 5 gists 
  'RroLe1AKYMkpduI7axRdM7mTxVROlI': function(data) {
    return data.gists >= 5;
  },

  // Add 10 gists 
  'jKz0vUQ8RORWdvPG9NHknG2IKD3n8S': function(data) {
    return data.gists >= 10;
  }

};