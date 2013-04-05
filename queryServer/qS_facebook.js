exports.options = function(auth) {
  return {
    host: 'localhost',
    port: 8075,
    path: '/?access_token='+auth
  }
};

exports.functions = {

  // Add 10 friends
  '4i3ipPZEq88i0bj9ZMiO4I8CGhBHsj': function(data) {
    return data.friend_count >= 10;
  },

  // Add 50 friends
  'JY88jctEQ9Ze1qk2RG7lPPFXpNdVYT': function(data) {
    return data.friend_count >= 50;
  },

  // Add 100 friends
  'T1jQDwGManXranbpmOep922uG7sYir': function(data) {
    return data.friend_count >= 100;
  },

  // Add Photo
  '0pzom5BuhFOP3G6LwPm0oythCYGv8T': function(data) {
    return data.photo_count >= 1;
  },

  // Add 100 Photo
  'gBAyOvu7Yzq9lvQuviF3bWFBRMnGVO': function(data) {
    return data.photo_count >= 100;
  },

  // Add 300 Photo
  'mKOk0k81RVEOf5UcH9pFX8OAzwz77S': function(data) {
    return data.photo_count >= 300;
  },

  // Add 5 Likes
  'lM92fNOvGl1ZwhSoJenSQAi6ObkRN7': function(data) {
    return data.likes_count >= 5;
  },

  // Add 30 Likes
  'RX7VbPD4WxPLsVx5nGicjt70Avvi6r': function(data) {
    return data.likes_count >= 30;
  },

  // Add 50 Likes
  'DpJUQvJYEaL0jmqSzGwaQBohSeTgyk': function(data) {
    return data.likes_count >= 50;
  },

  // Member of Achivster group?
  'QTBBJJfqWeSWI7W6TcNgKQOAs4BeGj': function(data) {
    return data.is_achivster === true;
  },

  // Likes 5 Movies
  'R8l8a0PccUPlz1qnDu43MwEyKdDzjr': function(data) {
    return data.movies >= 5;
  },

  // Likes 5 Books
  'y7Exd7K1j6akecxUn26BUqZtzSWD3r': function(data) {
    return data.books >= 5;
  },

  // Likes 5 Band
  'qqTsk14MLljg891zorZSQgvkyRH7Rh': function(data) {
    return data.music >= 5;
  },

  // Likes 5 tv
  'YYXbmf89bhLejAzvDbcMM0KUZf5jZx': function(data) {
    return data.tv >= 5;
  }

};