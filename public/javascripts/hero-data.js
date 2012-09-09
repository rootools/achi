// Client version of hero-data node.js module
// https://github.com/rootools/hero-data

var hd = {};

hd.now = function(format, time, type) {
  if(type == 'numeric' || type == '') {
    var time = new Date(time);

    var DD = addNull(time.getDate());
    var MM = addNull(time.getMonth() + 1);
    var YYYY = time.getFullYear();
    var hh = addNull(time.getHours());
    var mm = addNull(time.getMinutes());
    var ss = addNull(time.getSeconds());
    var res = format.replace('DD', DD);
    var res = res.replace('MM', MM);
    var res = res.replace('YYYY', YYYY);
    var res = res.replace('hh', hh);
    var res = res.replace('mm', mm);
    var res = res.replace('ss', ss);

    return res;
  }
}

function addNull(param) {
  if (param < 10) {
    param = '0' + param;
  } else {
    param = param.toString();
  }
  return param;
}
