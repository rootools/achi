var http = require('http');
var util = require('util');
var url = require('url');
var oauth = require('oauth').OAuth;

var bitbucketOA = new oauth(
  'https://bitbucket.org/!api/1.0/oauth/request_token',
  'https://bitbucket.org/!api/1.0/oauth/access_token',
  'ENSfZreEzhHYjtWLmG',
  'kbgFjZNAcMADEmpF44c2wrARTrY3NKEY',
  '1.0',
  'http://achivster.com/add_service/bitbucket',
  'HMAC-SHA1'
);

http.createServer(function (req, res) {
  var query = url.parse(req.url, true).query;

  bitbucketOA.get('https://api.bitbucket.org/1.0/user', query.token, query.secret, function(err, data) {
    data = JSON.parse(data);

    var profile = data;
      console.log(profile);
      res.end(JSON.stringify(profile));
    });
  
  });

}).listen(process.env.VCAP_APP_PORT || 8055);