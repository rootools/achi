var http = require('http');
var util = require('util');
var url = require('url');
var request = require('request');
var crypto = require('crypto');

http.createServer(function (req, res) {
  var query = url.parse(req.url, true).query;
  var response = {};
  
  // Refresh access_token
  request.post('http://api.odnoklassniki.ru/oauth/token.do', {form: {
    refresh_token :query.refresh_token,
    grant_type: 'refresh_token',
    client_id: 174988544,
    client_secret: '3835C62F2369CCB8E64D3163'}}, function(e, r, body){
      var access_token = JSON.parse(body).access_token;

      // Get Users group
      request.get('http://api.odnoklassniki.ru/fb.do?method=group.getUserGroupsV2&access_token='+access_token+'&application_key=CBAOBPGLABABABABA&sig='+getSig('group.getUserGroupsV2', access_token), function(e, re, b) {
        var groups = JSON.parse(b).groups.length;
        response.groups = groups;

        res.end(JSON.stringify(response));
      });
  });

}).listen(process.env.VCAP_APP_PORT || 8015);

function getSig(method, access_token) {
  var sig = crypto.createHash('md5').update([
      'application_key=CBAOBPGLABABABABA',
      'method='+method,
      crypto.createHash('md5').update(access_token + '3835C62F2369CCB8E64D3163', 'utf8').digest('hex')
      ].join(''), 'utf8').digest('hex');
  return sig;
}