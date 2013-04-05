exports.options = function(auth) {
  return {
    host: 'localhost',
    port: 8055,
    path: '/?token='+auth.token+'&secret='+auth.secret
  }
};

exports.functions = {

  // Add 1 repo
  'feUPePCCAEz5Jfq1jmMLxDeKJXm7aY': function(data) {
    return data.repo_count >= 1;
  },

  // Add 5 repo
  'qWBEuYRGSDOjzIe6OLrHNDLonmqWhk': function(data) {
    return data.repo_count >= 5;
  },

  // Add 10 repo
  'TS589gtvOJo80eyInViBdQ1mAFQlik': function(data) {
    return data.repo_count >= 10;
  },

  // Add 30 repo
  'ssewrd1sblSssoqyzDeDtMNYymwUPz': function(data) {
    return data.repo_count >= 30;
  },

  // Use wiki
  'XFxmtfB80a1NHCKtcTQ4hgYuP8V2e4': function(data) {
    return data.have_wiki === true;
  },

  // Use issues
  'rJvkcmWfOhEgU92beNHXwxiB56NE0u': function(data) {
    return data.have_issues === true;
  },

  // Use 3 lang
  'XfbaqTpsF9ULbdGnikknRYrTMbkzwS': function(data) {
    return data.lang_list.length >= 3;
  },

  // Use 5 lang
  'wLPMP9z6zCG4mBbeONO4gyBoqtVYjw': function(data) {
    return data.lang_list.length >= 5;
  }

};