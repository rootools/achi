exports.options = function(auth) {
  return {
    host: 'localhost',
    port: 8035,
    path: '/?token='+auth.access_token+'&id='+auth.id
  };
};

exports.functions = {

  // Add 1 Media
  'NHaBLwZK51sOGIO0EQWHddDCnEEAMM': function(data) {
    return data.media >= 1;
      
  },

  // Add 50 Media
  'x7pDo1RB61PvZTMAIn0OlJUitBM61m': function(data) {
    return data.media >= 50;
  },

  // Add 100 Media
  'mpHGMSuBKCJNMUJ2d23GLT1r2dY6oy': function(data) {
    return data.media >= 100;
  },

  // Add 500 Media
  'hqx178WgQ9BPisD1RsnnehAJugEzMT': function(data) {
    return data.media >= 500;
  },

  // Follow 1 people
  'ZgQdCo45saEu45AOKim6WVnGn5vMfU': function(data) {
    return data.follows >= 1;
  },

  // Follow 1 people
  'ZgQdCo45saEu45AOKim6WVnGn5vMfU': function(data) {
    return data.follows >= 1;
  },

  // Follow 10 people
  'BZMOU4DCk8NxiN6AIs2xELYJKDJvf8': function(data) {
    return data.follows >= 10;
  },

  // Follow 50 people
  'c9xwE32sZLFJhpApnCBtlHlGFRkNNy': function(data) {
    return data.follows >= 50;
  },

  // Follow 100 people
  '2l7cIeLzMF4jQlZgxjUWtluly5WBxH': function(data) {
    return data.follows >= 100;
  },

  // Followed 1 people
  'B5NPseFzzYbbVUFk2NqWftfUiVGx6G': function(data) {
    return data.followed_by >= 1;
  },

  // Followed 10 people
  'pDOmoXjoxbSBryVwcVKpVYUwdu0bgg': function(data) {
    return data.followed_by >= 10;
  },

  // Followed 50 people
  'dF7m0NxU4xHnFOsnrdDkcXRzwQP8Wz': function(data) {
    return data.followed_by >= 50;
  },

  // Followed 100 people
  'sKwTXo2DgXUbTi3PB89tur9CFYfuG9': function(data) {
    return data.followed_by >= 100;
  }

};