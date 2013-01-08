var http = require('http');
var https = require('https');
var util = require('util');
var url = require('url');

http.createServer(function (req, res) {
  var query = url.parse(req.url, true).query;
  var response = {};

  getData('/user', query.token, function(data) {
    response.followers = data.followers;
    response.following = data.following;
    response.repo_count = data.public_repos + data.total_private_repos;
    response.public_repos = data.public_repos;
    response.total_private_repos = data.total_private_repos;
    response.gists = data.public_gists + data.private_gists;
    getData('/user/repos', query.token, function(repo) {
      response.have_wiki = have_wiki(repo);
      response.have_issues = have_issues(repo);
      res.end(JSON.stringify(response));
    });
  });

}).listen(process.env.VCAP_APP_PORT || 8045);

function getData(query, access_token, cb) {

  var options = {
      host: 'api.github.com',
      method: 'GET'
  }

  options.path = query+'?access_token='+access_token;

  var callback = function(response) {
    var str = '';
    response.on('data', function(chunk) {
      str += chunk;
    });

    response.on('end', function() {
      str = JSON.parse(str);
      cb(str);
    });
  }

  https.request(options, callback).end();
}

function have_wiki(data) {
  for(var i in data) {
    if(data[i].has_wiki) {
      return true;
    }
  }
  return false;
}

function have_issues(data) {
  for(var i in data) {
    if(data[i].has_issues) {
      return true;
    }
  }
  return false;
}
