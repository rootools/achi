exports.options = function(auth) {
  return {
    host: 'localhost',
    port: 8095,
    path: '/?steamid='+auth.steamid
  };
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
  
  // Spent 3 hours
  'uFRvENrMALXp0cbp7PFOBjFvzCPKX7': function(data) {
    return data.maxTime >= 3;
  },
  
  // Spent 10 hours
  'gog4ZhFuVSOlftHUsbEfv4V0NqXPhO': function(data) {
    return data.maxTime >= 10;
  },
  
  // Spent 25 hours
  '18yo4aHrVeJP148DFIVq81k5JQIhpc': function(data) {
    return data.maxTime >= 25;
  },
  
  // Spent 50 hours
  'J1Nw8Hb46pZ2LrMWwgNnKeWsB5Ys0T': function(data) {
    return data.maxTime >= 50;
  },
  
  // Spent 100 hours
  'RJw4qBN19WmqqC5xzV1PltrW4rXu7q': function(data) {
    return data.maxTime >= 100;
  },
  
  // Spent 250 hours
  '7j3CPivAotkWfakZov48EuQYv9UINu': function(data) {
    return data.maxTime >= 250;
  },
  
  // Spent 500 hours
  'eigOOMeYOZhhIj8ZwvmQo8fpnUaZfI': function(data) {
    return data.maxTime >= 500;
  },
  
  // Spent 1000 hours
  '8PauzohdUvbF6Vn9xxJNtwbqopy9ao': function(data) {
    return data.maxTime >= 1000;
  },
  
  // Add 5 friends
  'cQdalOmbbiEHcYbaHmWPIqmAPYlGRM': function(data) {
    return data.friends >= 5;
  },
  
  // Add 10 friends
  '993miCr5rukdgRSp07sKzpXojHSXxQ': function(data) {
    return data.friends >= 10;
  },
  
  // Add 20 friends
  '0ICY8ay5QmsJhkoBi6hb9ov4CmPtzt': function(data) {
    return data.friends >= 20;
  }
  
};
