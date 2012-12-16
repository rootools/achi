function getAchievementsList(service) {
  sync('webapi', {action:"getAchievementsList", service:service}, function(fullAchievementsList) {
    sync('webapi', {action:"userAchievementsList", service:service}, function(userAchievementsList) {
      if(userAchievementsList.achievements === undefined) {userAchievementsList.achievements = [];}
      if(userAchievementsList === null) { userAchievementsList = {}; userAchievementsList.achievements = []; }
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
//    toRenderAchievementsList.push(achievement);
    html += generateAchievement(achievement);
  }
//  var toRenderAchievementsList = checkVisibleAchievements(toRenderAchievementsList);
//  for(var i=0;i<toRenderAchievementsList.length;i++) {
//    html += generateAchievement(toRenderAchievementsList[i]);
//  }

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

function last_achiv_event(elem) {
  var flag = $(elem).attr('class').split('double').length;
    if(flag === 1 ) {
      $('.last_achiv_tile').removeClass('double');
      $('.last_achiv_tile').css('z-index', '');
      $('.last_achiv_tile').children('.tile-content').children('.last_achiv_tile_name').remove();
      $('.last_achiv_tile').children('.brand').children('.social_sharing').html('');
      
      var achiv_name = $(elem).attr('title');
      var social_sharing = create_social_sharing_pannerl(elem, achiv_name);
      $(elem).children('.tile-content').append('<h3 class="last_achiv_tile_name">'+achiv_name)+'</h3>';
      $(elem).children('.brand').children('.social_sharing').html(social_sharing);
      $(elem).addClass('double');
      $(elem).css('z-index', '888');
      if($($('.last_achiv_tile')[5]).attr('title') === $(elem).attr('title')) {
        $(elem).css('right', '160px');
      }
    } else {
      if($($('.last_achiv_tile')[5]).attr('title') === $(elem).attr('title')) {
        $(elem).css('right', '');
      }
      $(elem).children('.tile-content').children('.last_achiv_tile_name').remove();
      $(elem).children('.brand').children('.social_sharing').html('');
      $(elem).removeClass('double');
      $(elem).css('z-index', '');
    }
}

function create_social_sharing_pannerl(elem, name) {
  var icon = location.origin + $(elem).children('.tile-content').children('.achiv_icon').attr('src');
  var points = $(elem).children('.brand').children('.badge').text();
  var url = 'http://'+location.host+'/dashboard/user/' + $('.grid').attr('id');
  var title = 'Я заработал достижение!';
  var text = '"'+name + '" за '+points+' очков! #ачивстер #achivster';
  var html = '';
  // VK
  // http://vk.com/pages?oid=-1&p=%D0%9F%D1%83%D0%B1%D0%BB%D0%B8%D0%BA%D0%B0%D1%86%D0%B8%D1%8F_%D1%81%D1%82%D0%BE%D1%80%D0%BE%D0%BD%D0%BD%D0%B8%D1%85_%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86
  var vk_sharing_object_1 = {url: url, title: 'Я заработал достижение!', image: icon, noparse: true, description: text};
  var vk_sharing_object_2 = {type: 'custom', text: '<i class="websymbols social_sharing_button" id="vkontakte_sharing">v</i>'};
  html += VK.Share.button(vk_sharing_object_1, vk_sharing_object_2);
  // Facebook
  // http://developers.facebook.com/docs/reference/dialogs/feed/
  html += '<a href="https://www.facebook.com/dialog/feed?app_id=258024554279925&link=https://developers.facebook.com/docs/reference/dialogs/&picture='+icon+'&name='+title+'&caption=http://achivster.com/&description='+encodeURIComponent(text)+'&redirect_uri=http://'+location.host+'/dashboard&link='+url+'">';
  html += '<i class="websymbols social_sharing_button" id="facebook_sharing">f</i></a>';
  // Twitter
  // https://dev.twitter.com/docs/tweet-button
  
  html += '<a target="_blank" href="http://twitter.com/intent/tweet?text='+encodeURIComponent(title)+'+'+encodeURIComponent(text)+' '+encodeURIComponent(url)+'">';
  html += '<i class="websymbols social_sharing_button" id="twitter_sharing">t</i></a>';
  return html;
}

$(function() {

  $('.dashboard_menu_button').click(function() {
    getAchievementsList(this.firstChild.textContent);
  });

  $('.dashboard_back').click(function() {
    history.go(-1);
  });
  
  $('.last_achiv_tile').click(function() {
    last_achiv_event(this);
  });

});