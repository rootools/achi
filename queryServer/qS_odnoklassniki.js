exports.options = function(auth) {
  console.log(auth);
  return {
    host: 'localhost',
    port: 8015,
    path: '/?refresh_token='+auth
  }
};

exports.functions = {

  // Add Achivster group
  'e7UX27W17stlUHzUW9NaP8D3ynImpU': function(data) {
    //return data. >= 10;
  }
};