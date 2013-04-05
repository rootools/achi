exports.options = function(auth) {
  return {
    host: 'localhost',
    port: 8085,
    path: '/?access_token='+auth.access_token+'&uid='+auth.user_id
  };
};

exports.functions = {

  // Add 10 friends
  '0NwF1LKsXAcLNWIdmadLThRksh7k4l': function(data) {
    return data.friendsCount >= 10;
  },

  // Add 50 friends
  '3bgyKw50Y0OKG7KJ3UPDL9NwSwNp14': function(data) {
    return data.friendsCount >= 50;
  },

  // Add 100 friends
  'ExX284q5Iz7O4v94JcjaI7uDTZYdHQ': function(data) {
    return data.friendsCount >= 100;
  },

  // Add 500 friends
  'xbELzMG28H5oUA7zvocKcxasDrmvIh': function(data) {
    return data.friendsCount >= 500;
  },

  // Add Post
  'sVb9UmoqbV1iQJzrtgN419bsFOCEhx': function(data) {
    return data.wallCount >= 1;
  },

  // Add 100 Post
  'Qqv6WCsPco3uQXBuB37ZDm6MvXN6J9': function(data) {
    return data.wallCount >= 100;
  },

  // Add 500 Post
  'pDOZyeGIEY6xs8LPZoWeqAM4geKv8i': function(data) {
    return data.wallCount >= 500;
  },

  // Add 1000 Post
  'cXIk4iwKdkvFNu4WpAch9m84RAjbzK': function(data) {
    return data.wallCount >= 1000;
  },

  // Add Audio
  'wZLlqdxSd4FE7S6JXQsAGenVcIq8zC': function(data) {
    return data.audioCount >= 1;
  },

  // Add 100 Audio
  'yiaTkZ8PrzWNGGIgOE1kksWSG1ZJve': function(data) {
    return data.audioCount >= 100;
  },

  // Add 500 Audio
  'OrRp5s2IAevQsh3vNGBfvyYJKDknR1': function(data) {
    return data.audioCount >= 500;
  },

  // Add 1000 Audio
  'bpizS4iRgv2FQijSM3lwxhHNJBuGZH': function(data) {
    return data.audioCount >= 1000;
  },

  // Add Photo
  'kdJHH5dLZ57i0qfH3gsniLSSTEBxQ9': function(data) {
    return data.photosCount >= 1;
  },

  // Add 100 Photo
  'NDFIaAgpKrGIqwO5PXdAAcntqTz8kF': function(data) {
    return data.photosCount >= 100;
  },

  // Add 300 Photo
  'FUZLmAHTPXeCx956ELb6W5FJflotId': function(data) {
    return data.photosCount >= 300;
  },

  // Add 300 Photo
  'FUZLmAHTPXeCx956ELb6W5FJflotId': function(data) {
    return data.photosCount >= 300;
  },

  // Add Video
  'MGTNzcrH5Ufnz1PyEujwQILeY4TgUt': function(data) {
    return data.videoCount >= 1;
  },

  // Add 50 Video
  'ed8EXsl4gtD0rTThhI898ffTrFBL0Z': function(data) {
    return data.videoCount >= 50;
  },

  // Add 100 Video
  'h2gOKmohUKR1LgoXOodZSQ6cQmlMec': function(data) {
    return data.videoCount >= 100;
  },

  // Earned Post Like
  'Ut3pRL5dgWGx5FX0ukhQeEdgUMil6e': function(data) {
    return data.maxPostLike >= 1;
  },

  // Earned 50 Post Like
  'pSeJ999JzZ2SkyD8iWffE34Vv874zu': function(data) {
    return data.maxPostLike >= 50;
  },

  // Earned 100 Post Like
  'IrYhDD22CneQbsvcgclRqlWmTQCLuf': function(data) {
    return data.maxPostLike >= 100;
  },

  // Earned Photo Like
  'NNJ20S3CqA9vIWiJ64fx1FzLp8WmES': function(data) {
    return data.maxPhotoLike >= 1;
  },

  // Earned 50 Photo Like
  'r2F2FQ7OcX8U5ElQMskZwRAwZO8rnV': function(data) {
    return data.maxPhotoLike >= 50;
  },

  // Earned 100 Photo Like
  'ie7bdaVQw0MhHTY008mcVS8EJgYDem': function(data) {
    return data.maxPhotoLike >= 100;
  },

  'Kjo7fJlDc41ea2WGfMxs2znDapfCx5': function(data) {
    return data.is_achivster === 1;
  }

};