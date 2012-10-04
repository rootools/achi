function getData(query, cb) {
  $.post('editor_api', query, function(data, status, jqXHR) {
    cb(data.data);
  });
}

function getAchivList(service) {

  var content = document.getElementById('content');
  content.innerHTML = ''

  var html = '<table class="bordered"><tr><th>aid</th><th>name</th><th>description</th><th>position</th><th>edit</th><th>del</th></tr>';
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
      console.log(id);
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
  console.log(elem.parentNode.id, elem.id);

  if(elem.id == 'table_del') {
    getData({command: 'delete_row', aid: elem.parentNode.id}, function(data) {
      $('#'+elem.parentNode.id).fadeOut(400, function() {
        $('#'+elem.parentNode.id).remove();
      });
    });
  }
}

$(function() {
  getService();
});
