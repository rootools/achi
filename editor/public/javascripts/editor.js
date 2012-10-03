function getData(query, cb) {
  $.post('editor_api', query, function(data, status, jqXHR) {
    cb(data.data);
  });
}

function getAchivList(service) {

  var content = document.getElementById('content');
  content.innerHTML = ''

  var html = '<table class="bordered"><tr><th>aid</th><th>name</th><th>description</th><th>position</th></tr>';
  getData({command: 'get_achiv_list', service:service}, function(data) {
    for(var i=0;i<data.length;i++) {
      html += '<tr><td>'+data[i].aid+'</td><td>'+data[i].name+'</td><td>'+data[i].description+'</td><td>'+data[i].position+'</td></tr>';
    }
    html += '</table>';
    
    content.innerHTML = html;
  });
}

function getService() {
  var body = document.getElementById('menu');
  var html = '';

  getData({command:'get_service_list'}, function(data) {
    for(var i=0;i<data.length;i++) {
      html += '<button id="service_menu_'+data[i]+'" class="service_menu">'+data[i]+'</button>';
    }
    html += '<button id="add_achiev" class="bg-color-blue">+</button>';

    body.innerHTML = html;
    
    $('.service_menu').bind('click', function() {
      var id = this.id.split('_')[2];
      console.log(id);
      getAchivList(id);
    });
  });

}

$(function() {
  getService();
});
