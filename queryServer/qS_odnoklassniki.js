exports.options = function(auth) {
  return {
    host: 'localhost',
    port: 8015,
    path: '/?refresh_token='+auth.refresh_token
  }
};

exports.functions = {

  // Add Achivster group
  'e7UX27W17stlUHzUW9NaP8D3ynImpU': function(data) {
    return data.isAchivster = true;
  }
};
