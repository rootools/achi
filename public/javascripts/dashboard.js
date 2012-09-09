function sync(param, cb) {
  $.post('/webapi', param, function(data) {
    cb(data);
  }, 'json');
}

function getAchievementsList(service) {
  sync({action:"getAchievementsList", service:service}, function(fullAchievementsList) {
    sync({action:"userAchievementsList", service:service}, function(userAchievementsList) {
      renderAchievementsList(fullAchievementsList, userAchievementsList.achievements);
    });
  });
}

function renderAchievementsList(fullAchievementsList, userAchievementsList) {
  var dashboard_list = document.getElementById('dashboard_list');
  dashboard_list.innerHTML = '';
  var html = '<table border=1>';

  for(var i=0;i<fullAchievementsList.length;i++) {
    for(var r=0;r<userAchievementsList.length;r++) {
      if(userAchievementsList[r].aid == fullAchievementsList[i].aid) {
        var earned = true;
        var time = hd.now('DD-MM-YYYY', userAchievementsList[r].time, 'numeric');
        break;
      } else {
        var earned = false;
        var time = 'never';
      }
    }
    html += '<tr><td>'+fullAchievementsList[i].aid+'</td><td>'+fullAchievementsList[i].name+'</td><td>'+fullAchievementsList[i].description+'</td><td>'+earned+'</td><td>'+time+'</td></tr>';
  }
  dashboard_list.innerHTML = html;
}


$(function() {

  $('.dashboard_menu_button').click(function() {
    getAchievementsList(this.firstChild.textContent);
  });

});
