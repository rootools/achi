function sync(param, cb) {
  $.post('/webapi', param, function(data) {
    cb(data);
  }, 'json');
}

function getAchievementsList(service) {
  sync({action:"getAchievementsList", service:service}, function(fullAchievementsList) {
    sync({action:"userAchievementsList", service:service}, function(userAchievementsList) {
      if(userAchievementsList.achievements == undefined) {userAchievementsList.achievements = [];}
      if(userAchievementsList == null) { userAchievementsList = {}; userAchievementsList.achievements = []; }
      renderAchievementsList(fullAchievementsList, userAchievementsList.achievements);
    });
  });
}

function renderAchievementsList(fullAchievementsList, userAchievementsList) {
  var dashboard_list = document.getElementById('dashboard_list');
  dashboard_list.innerHTML = '';
  var html = '';

  var toRenderAchievementsList = [];
  for(var i=0;i<fullAchievementsList.length;i++) {
    var achievement = fullAchievementsList[i];
    for(var r=0;r<userAchievementsList.length;r++) {
      if(userAchievementsList[r].aid == fullAchievementsList[i].aid) {
        achievement.earned = true;
        achievement.time = hd.now('DD-MM-YYYY', userAchievementsList[r].time, 'numeric');
        break;
      } else {
        achievement.earned = false;
        achievement.time = 'never';
      }
    }
    toRenderAchievementsList.push(achievement);
  }
  var toRenderAchievementsList = checkVisibleAchievements(toRenderAchievementsList);
  for(var i=0;i<toRenderAchievementsList.length;i++) {
    html += generateAchievement(toRenderAchievementsList[i]);
  }

  dashboard_list.innerHTML = html;
  setAchievementBadgListenters(toRenderAchievementsList);
}

function checkVisibleAchievements(arr) {
  for(var i=0;i<arr.length;i++) {
    if(arr[i].earned == true && arr[i+1].earned == false && arr[i].child == arr[i+1].aid) {
      arr[i].visible = 'block';
      arr[i+1].visible = 'block';
    } else {
      if(arr[i].visible != 'block') { arr[i].visible = 'none';} 
    }
  }
  return arr;
}

function generateAchievement(achievement) {
  var html = ''
  html += '<div class="achievementBadg earned_'+achievement.earned+'" id='+achievement.aid+' style="display:'+achievement.visible+'">';

    html += '<div class="achievementIcon"></div>';

    html += '<div class="achievementInfoZone">';
      html += '<div class="achievementName">'+achievement.name+'</div>';
//      html += '<div class="achievementDescr">'+achievement.description+'</div>';
      html += '<div class="achievementDescr">Descr</div>';
    html += '</div>';
    
    html += '<div class="achievementPointZone">';
      html += '<div class="achievementPoints">10</div>';
      html += '<div class="achievementTime">'+achievement.time+'</div>';
    html += '</div>';
  html += '</div>';
  return html;
}

function setAchievementBadgListenters(achivList) {
  $('.achievementBadg').bind('click', function() {
    var id = $(this).attr('id');
    console.log(achivList);
  });
}

$(function() {

  $('.dashboard_menu_button').click(function() {
    getAchievementsList(this.firstChild.textContent);
  });

});
