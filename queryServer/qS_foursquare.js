exports.options = function(auth) {
  return {
    host: 'localhost',
    port: 8025,
    path: '/?token='+auth.access_token+'&id='+auth.id
  };
};

exports.functions = {

  // 1 Checkin
  '0000004c4f08667a0803bbaa202ab7': function(data) {
    for(var n in data) {
      if(data[n].badgeId === '4c4f08667a0803bbaa202ab7') {
        return true;
      }
    }
    return false;
  },

  // 10 Checkin
  '0000004c4f08667a0803bbab202ab7': function(data) {
    for(var n in data) {
      if(data[n].badgeId === '4c4f08667a0803bbab202ab7') {
        return true;
      }
    }
    return false;
  },

  // 25 Checkin 'Expolorer'
  '0000004c4f08667a0803bbac202ab7': function(data) {
    for(var n in data) {
      if(data[n].badgeId === '4c4f08667a0803bbac202ab7') {
        return true;
      }
    }
    return false;
  },

  // 50 Checkin 'Superstar'
  '0000004c4f08667a0803bbad202ab7': function(data) {
    for(var n in data) {
      if(data[n].badgeId === '4c4f08667a0803bbad202ab7') {
        return true;
      }
    }
    return false;
  },

  // 'Local'
  '0000004c4f08667a0803bbb0202ab7': function(data) {
    for(var n in data) {
      if(data[n].badgeId === '4c4f08667a0803bbb0202ab7') {
        return true;
      }
    }
    return false;
  },

  // 'Super User'
  '0000004c4f08667a0803bbb1202ab7': function(data) {
    for(var n in data) {
      if(data[n].badgeId === '4c4f08667a0803bbb1202ab7') {
        return true;
      }
    }
    return false;
  },

  // '9 to 5'
  '0000004caa535f30bd9eb05be32923': function(data) {
    for(var n in data) {
      if(data[n].badgeId === '4caa535f30bd9eb05be32923') {
        return true;
      }
    }
    return false;
  },

  // 'Back to School'
  '000000503552d6011c38107f4f08ec': function(data) {
    for(var n in data) {
      if(data[n].badgeId === '503552d6011c38107f4f08ec') {
        return true;
      }
    }
    return false;
  },

  // 'Mall Rat'
  '0000004ecbdd9e7beb20ebed8da36d': function(data) {
    for(var n in data) {
      if(data[n].badgeId === '4ecbdd9e7beb20ebed8da36d') {
        return true;
      }
    }
    return false;
  },

  // 'Trainspotter'
  '0000004f6a48fa7beb7e5831d4eb25': function(data) {
    for(var n in data) {
      if(data[n].badgeId === '4f6a48fa7beb7e5831d4eb25') {
        return true;
      }
    }
    return false;
  },

  // 'Super Mayor'
  '0000004c4f08667a0803bbe4202ab7': function(data) {
    for(var n in data) {
      if(data[n].badgeId === '4c4f08667a0803bbe4202ab7') {
        return true;
      }
    }
    return false;
  },

  // 'Hats Off'
  '0000004f8d9b9b7beb82ec71aa9ef6': function(data) {
    for(var n in data) {
      if(data[n].badgeId === '4f8d9b9b7beb82ec71aa9ef6') {
        return true;
      }
    }
    return false;
  },

  // 'Overshare'
  '0000004c4f08667a0803bbc3202ab7': function(data) {
    for(var n in data) {
      if(data[n].badgeId === '4c4f08667a0803bbc3202ab7') {
        return true;
      }
    }
    return false;
  },

  // 'Swimmies'
  '0000004c7d1dd0978976b0c7cee939': function(data) {
    for(var n in data) {
      if(data[n].badgeId === '4c7d1dd0978976b0c7cee939') {
        return true;
      }
    }
    return false;
  },

  // 'Pizzaiolo'
  '0000004c4f08667a0803bbdd202ab7': function(data) {
    for(var n in data) {
      if(data[n].badgeId === '4c4f08667a0803bbdd202ab7') {
        return true;
      }
    }
    return false;
  },

  // 'Great Outdoors'
  '0000004c7d1deb978976b064cfe939': function(data) {
    for(var n in data) {
      if(data[n].badgeId === '4c7d1deb978976b064cfe939') {
        return true;
      }
    } 
    return false;
  },

  // 'JetSetter'
  '0000004c4f08667a0803bbda202ab7': function(data) {
    for(var n in data) {
      if(data[n].badgeId === '4c4f08667a0803bbda202ab7') {
        return true;
      }
    }
    return false;
  },

  // 'Zoetrope'
  '0000004c4f08667a0803bbdc202ab7': function(data) {
    for(var n in data) {
      if(data[n].badgeId === '4c4f08667a0803bbdc202ab7') {
        return true;
      }
    }
    return false;
  },

  // 'Fresh Brew'
  '0000004d24bfee668f60fc7b32b26f': function(data) {
    for(var n in data) {
      if(data[n].badgeId === '4d24bfee668f60fc7b32b26f') {
        return true;
      }
    }
    return false;
  },

  // 'Warhol'
  '0000004c4f08667a0803bbdf202ab7': function(data) {
    for(var n in data) {
      if(data[n].badgeId === '4c4f08667a0803bbdf202ab7') {
        return true;
      }
    }
    return false;
  },

  // 'Bento'
  '0000004ebb07357bebd6a83f116c24': function(data) {
    for(var n in data) {
      if(data[n].badgeId === '4ebb07357bebd6a83f116c24') {
        return true;
      }
    }
    return false;
  },

  // 'Bookworm'
  '0000004cf5199da41a60fcf71d2fc0': function(data) {
    for(var n in data) {
      if(data[n].badgeId === '4cf5199da41a60fcf71d2fc0') {
        return true;
      }
    }
    return false;
  },

  // 'Greasy Spoon'
  '0000004e988be87beb567e777d83e9': function(data) {
    for(var n in data) {
      if(data[n].badgeId === '4e988be87beb567e777d83e9') {
        return true;
      }
    }
    return false;
  },

  // 'Crunked'
  '0000004c4f08667a0803bbaf202ab7': function(data) {
    for(var n in data) {
      if(data[n].badgeId === '4c4f08667a0803bbaf202ab7') {
        return true;
      }
    }
    return false;
  },

  // 'Century Club'
  '0000004d5ac1585e7788bf97e98f9e': function(data) {
    for(var n in data) {
      if(data[n].badgeId === '4d5ac1585e7788bf97e98f9e') {
        return true;
      }
    }
    return false;
  },

  // 'Swarm'
  '0000004c4f08667a0803bbe1202ab7': function(data) {
    for(var n in data) {
      if(data[n].badgeId === '4c4f08667a0803bbe1202ab7') {
        return true;
      }
    }
    return false;
  },

  // 'Flame Broiled'
  '0000004f0da0207bebfc145ffdad57': function(data) {
    for(var n in data) {
      if(data[n].badgeId === '4f0da0207bebfc145ffdad57') {
        return true;
      }
    }
    return false;
  },

  // 'Fried Check-in'
  '0000004dbae35b4159a4e20f525b96': function(data) {
    for(var n in data) {
      if(data[n].badgeId === '4dbae35b4159a4e20f525b96') {
        return true;
      }
    }
    return false;
  },

  // 'School Night'
  '0000004c4f08667a0803bbb3202ab7': function(data) {
    for(var n in data) {
      if(data[n].badgeId === '4c4f08667a0803bbb3202ab7') {
        return true;
      }
    }
    return false;
  },

  // 'Bender'
  '0000004c4f08667a0803bbae202ab7': function(data) {
    for(var n in data) {
      if(data[n].badgeId === '4c4f08667a0803bbae202ab7') {
        return true;
      }
    }
    return false;
  },

  // 'Molto Buono'
  '0000005177058d011cefa9d2befd7c': function(data) {
    for(var n in data) {
      if(data[n].badgeId === '5177058d011cefa9d2befd7c') {
        return true;
      }
    }
    return false;
  },
  
  // 'Shutterbug'
  '000000502ae142011c88ba3d9bfe5b': function(data) {
    for(var n in data) {
      if(data[n].badgeId === '502ae142011c88ba3d9bfe5b') {
        return true;
      }
    }
    return false;
  },
  
  // 'Baker`s Dozen'
  '0000004e454b72922ee4def2921e93': function(data) {
    for(var n in data) {
      if(data[n].badgeId === '4e454b72922ee4def2921e93') {
        return true;
      }
    }
    return false;
  },
  
  // 'Earl of Sandwich'
  '0000005177053f011cefa9d2beb127': function(data) {
    for(var n in data) {
      if(data[n].badgeId === '5177053f011cefa9d2beb127') {
        return true;
      }
    }
    return false;
  },
  
  // 'Red Square'
  '0000004f3c466d7beba248202a9c8f': function(data) {
    for(var n in data) {
      if(data[n].badgeId === '4f3c466d7beba248202a9c8f') {
        return true;
      }
    }
    return false;
  },
  
  // 'Munchies'
  '0000004c61a7048c2103bbe546ff35': function(data) {
    for(var n in data) {
      if(data[n].badgeId === '4c61a7048c2103bbe546ff35') {
        return true;
      }
    }
    return false;
  },

  // 'Animal House'
  '0000004c4f08667a0803bbb9202ab7': function(data) {
    for(var n in data) {
      if(data[n].badgeId === '4c4f08667a0803bbb9202ab7') {
        return true;
      }
    }
    return false;
  },

  // 'Gym Rat'
  '0000004c4f08667a0803bbd0202ab7': function(data) {
    for(var n in data) {
      if(data[n].badgeId === '4c4f08667a0803bbd0202ab7') {
        return true;
      }
    }
    return false;
  },

  // 'Super Swarm'
  '0000004c4f08667a0803bb1c212ab7': function(data) {
    for(var n in data) {
      if(data[n].badgeId === '4c4f08667a0803bb1c212ab7') {
        return true;
      }
    }
    return false;
  },

  // 'Players Club'
  '0000004f4585997beb15d09255d46e': function(data) {
    for(var n in data) {
      if(data[n].badgeId === '4f4585997beb15d09255d46e') {
        return true;
      }
    }
    return false;
  },

  // 'Ten Hundred'
  '0000004e0b9719922ec2dafe5c06c2': function(data) {
    for(var n in data) {
      if(data[n].badgeId === '4e0b9719922ec2dafe5c06c2') {
        return true;
      }
    }
    return false;
  },

  // 'Epic Swarm'
  '0000004c4f08677a0803bb4d212ab7': function(data) {
    for(var n in data) {
      if(data[n].badgeId === '4c4f08677a0803bb4d212ab7') {
        return true;
      }
    }
    return false;
  }


};
