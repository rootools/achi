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

    var profile = {};
    profile.repo_count = data.repositories.length;
    profile.lang_list = get_lang_list(data.repositories);
    profile.have_wiki = have_wiki(data.repositories);
    profile.have_issues = have_issues(data.repositories);
    res.end(JSON.stringify(profile));
  
  });

}).listen(8055, 'localhost');

function get_lang_list(data) {
  var lang_ls = [];
  for(var i in data) {
    if(lang_ls.indexOf(data[i].language) === -1) {
      lang_ls.push(data[i].language);
    }
  }
  return lang_ls;
}

function have_wiki(data) {
  for(var i in data) {
    if(data[i].has_wiki) {
      return true;
    }
  }
}

function have_issues(data) {
  for(var i in data) {
    if(data[i].has_issues) {
      return true;
    }
  }  
}
