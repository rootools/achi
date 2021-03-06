$(function(){
  $('.developers_menu').bind('click', function(){
    var event = this.id;
    $('.content_row').fadeOut(200);
    setTimeout(function() {
      if(event === 'achiv') {
        $('#achiv_row').css('display','block');
        $('#settings_row').css('display','none');
        $('#achiv_row').fadeIn(200);
      }
      if(event === 'settings') {
        $('#settings_row').css('display','block');
        $('#achiv_row').css('display','none');
        $('#settings_row').fadeIn(200);
      }
    }, 200);
  });

  $('#add_new_achiv').bind('click', function() {
    var zone = document.getElementById('create_new_achiv');
    zone.innerHTML = '';
    var html = '';
    html += '<form method="POST">';
    html += ' <div class="span6">';
    html += '   <div class="input-control text">';
    html += '     <input name="achiv_name" type="text" placeholder="Название" />';
    html += '   </div>';
    html += '   <div class="input-control text">';
    html += '     <input name="achiv_description" type="text" placeholder="Описание" />';
    html += '   </div>';
    html += '   <div class="input-control select">';
    html += '     <select name="points">';
    html += '       <option value=10>10</option>';
    html += '       <option value=20>20</option>';
    html += '       <option value=30>30</option>';
    html += '       <option value=50>50</option>';
    html += '     </select>';
    html += '   </div>';
    html += '   <input type="submit" value="Добавить"/>';
    html += ' </div>';
    html += '</form>';
    zone.innerHTML = html;
  });
  
  $('.edit_achiv_button').bind('click', function() {
    $('#achiv_list').addClass('span6');
    $('#achiv_list_edit').addClass('span6');
    $('#achiv_list_edit').css('display','block');
    var elem = $('#achiv_'+this.id).children();
    var name = elem.find('h3')[0].innerHTML;
    var descr = elem.find('p')[0].innerHTML;
    var points = elem.find('h3')[1].innerHTML;
    $('#edit_achiv_aid').val(this.id);
    $('#edit_achiv_name').val(name);
    $('#edit_achiv_descr').val(descr);
    $('#edit_achiv_points').val(points);
    $('#edit_achiv_aid_title').text(this.id);
  });
  
  // Sort method. Use jQuery UI Sortable func.
  // Width FIX!
  function SaveButton() {
    if($('#save_achiv_list_button_area').children().length === 0) {
      $('#save_achiv_list_button_area').append('<button id="save_achiv_list_button">Сохранить порядок</button>');
      $('#save_achiv_list_button').click('bind', function() {
        var aids = $('#sortable').children();
        var list = [];
        for(var i in aids) {
          if(aids[i].id) {
            var tmpObj = {};
            tmpObj.aid = aids[i].id.split('_')[1];
            tmpObj.position = i;
            list.push(tmpObj);
          }
          
        }
        sync('/webapi', {action: 'dev_save_achiv_list', list: list}, function(response) {
          location.reload();
        });
      });
    }
  }
  
  var fixHelper = function(e, ui) {
    ui.children().each(function() {
      $(this).width($(this).width());
    });
    return ui;
  };
  
  $( "#sortable" ).sortable({ axis: "y", helper: fixHelper }, {
    update: function( event, ui ) {
      SaveButton();
    }
  });
  $( "#sortable" ).disableSelection();
  
});
