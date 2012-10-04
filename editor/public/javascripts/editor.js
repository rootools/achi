function getData(query, cb) {
  $.post('editor_api', query, function(data, status, jqXHR) {
    cb(data.data);
  });
}

function getAchivList(service) {

  var content = document.getElementById('content');
  content.innerHTML = ''

  var html = '<table id="table_achiv" class="bordered"><tr><th>aid</th><th>name</th><th>description</th><th>position</th><th>edit</th><th>del</th></tr>';
  getData({command: 'get_achiv_list', service:service}, function(data) {
    for(var i=0;i<data.length;i++) {
      html += '<tr id="'+data[i].aid+'"><td>'+data[i].aid+'</td><td>'+data[i].name+'</td><td>'+data[i].description+'</td><td>'+data[i].position+'</td><td id="table_edit"><img src="images/edit.png" class="table_icon"></td><td id="table_del"><img src="images/remove.png" class="table_icon"></td></tr>';
    }
    html += '</table>';
    
    content.innerHTML = html;
    $('td').bind('click', function() {
      if(this.id == 'table_del' && confirm('DELETE??')) {
        tdClick(this);
      }
      if(this.id != 'table_del') {
        tdClick(this);
      }
    });
  });
}

function getService() {
  var body = document.getElementById('menu');
  var html = '';

  getData({command:'get_service_list'}, function(data) {
    for(var i=0;i<data.length;i++) {
      html += '<button id="service_menu_'+data[i]+'" class="service_menu">'+data[i]+'</button>';
    }
    html += '<button id="add_achiev" class="bg-color-green">+</button>';

    body.innerHTML = html;
    
    $('.service_menu').bind('click', function() {
      var id = this.id.split('_')[2];
      getAchivList(id);
    });

    $('#add_achiev').bind('click', function() {
      addNewAchiv(data);
    });
  });

}

function addNewAchiv(services) {

  var content = document.getElementById('content');
  content.innerHTML = '';

  var html = '<form action="/editor_api" method="POST">';
  html += '<div class="input-control select"><select name="service">';
  for(var i=0;i<services.length;i++) {
    html += '<option value='+services[i]+'>'+services[i]+'</option>';
  }
  html += '</select></div>';
  html += '<div class="input-control text"><input type="text" name="aid" placeholder="aid"/><span class="helper"></span></div>';
  html += '<div class="input-control text"><input type="text" name="name" placeholder="name"/><span class="helper"></span></div>';
  html += '<div class="input-control text"><input type="text" name="description" placeholder="description"/><span class="helper"></span></div>';
  html += '<div class="input-control text"><input type="text" name="position" placeholder="position"/><span class="helper"></span></div>';
  html += '<input type="hidden" name="command" value="add_new_achiv">';
  html += '<input type="submit" value="Submit"/>';
  html += '</form>';

  content.innerHTML = html;
}

function tdClick(elem) {

  if(elem.id == 'table_del') {
    getData({command: 'delete_row', aid: elem.parentNode.id}, function(data) {
      $('#'+elem.parentNode.id).fadeOut(400, function() {
        $('#'+elem.parentNode.id).remove();
      });
    });
  }

  if(elem.id == 'table_edit') {
    var achiv = {};
    achiv.aid = elem.parentNode.childNodes[0].innerHTML;
    achiv.name = elem.parentNode.childNodes[1].innerHTML;
    achiv.descr = elem.parentNode.childNodes[2].innerHTML;
    achiv.position = elem.parentNode.childNodes[3].innerHTML;

    console.log(achiv);

    showEditWindow(achiv);
  }
}

function showEditWindow(achiv) {
  var html = '';
  
  html += '<div id="window_edit">';
  html += '<center><h3>aid:'+achiv.aid+'</h3></center>';
  html += '<form method="POST" action="/editor_api">';
  html += '<div class="input-control text"><input type="text" name="name" value="'+achiv.name+'"/><span class="helper"></span></div>';
  html += '<div class="input-control text"><input type="text" name="description" value="'+achiv.descr+'"/><span class="helper"></span></div>';
  html += '<div class="input-control text"><input type="text" name="position" value="'+achiv.position+'"/><span class="helper"></span></div>';
  html += '<input type="hidden" name="aid" value="'+achiv.aid+'" />';
  html += '<input type="hidden" name="command" value="edit_achiv" />';
  html += '<center><button type="submit">save</button><button id="button_window_close">close</button></center>';
  html += '</div>';
  $('#content').append(html);
  $('#table_achiv').css({'width':'49%', 'position':'relative', 'float':'left'});
  $('#window_edit').css({'width':'49%', 'position':'relative', 'float':'left'});
  
  $('#button_window_close').bind('click', function() {
    $('#window_edit').remove();
    $('#table_achiv').css({'width':'100%', 'position':'', 'float':''});
  });

}

$(function() {
  getService();
});