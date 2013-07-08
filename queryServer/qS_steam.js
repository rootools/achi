exports.options = function(auth) {
  return {
    host: 'localhost',
    port: 8095,
    path: '/?steamid='+auth.steamid
  }
};

exports.functions = {

  // Add 1 game
  'armKjwrlEf8Dy2THgnOi0wCpSj0eFN': function(data) {
    return data.games >= 1;
  },
  
  // Add 5 games
  'Jv12bskGiHzwhDxynYQC9r4EkLDEeW': function(data) {
    return data.games >= 5;
  },
  
  // Add 10 games
  '2245F0FmS1t7XyLsmRlgLEIBt3oTXo': function(data) {
    return data.games >= 10;
  },
  
  // Add 25 games
  'lxoo3QxpzXclRPeJOwRIS9fZmspSCF': function(data) {
    return data.games >= 25;
  },
  
  // Add 50 games
  'YDbUWUO4hVBeCLPNcHN7d60xvb38EN': function(data) {
    return data.games >= 50;
  },
  
  // Add 100 games
  'Ua0cS1dRO61tsVr9tQlcnmxpIKczLV': function(data) {
    return data.games >= 100;
  },
};
