var assert = require('assert');
var Browser = require("zombie");
var browser = new Browser();
browser.site = 'http://localhost:8001';

describe('Login: ', function(){
  it('Write cookies', function(done){
    if(browser.cookies.length > 0) {
      done();
    } else {
      browser.visit('/login').
      
      then(function(){
        var chooser = browser.querySelector('#login_chooser');
        
        browser.clickLink(chooser);
        browser.fill('email', 'baboonweb@gmail.com');
        browser.fill('pass', '1');
        browser.pressButton('#login_button_login', function() {
          done();
        });
      }).

      fail(function(err){
        done(err);
      });
    }
  });
});

describe('Routes: ', function(){
  it('/friends', function(done){
    browser.visit("http://localhost:8001/friends", function () {    
      var resp = JSON.parse(browser.text());
      if(typeof(resp) === 'object' && resp[0].name && resp[0].photo && resp[0].uid && resp[0].points) {
        done();
      }
    });
  });
  
  it('/top/world', function(done){
    browser.visit("http://localhost:8001/top/world", function () {    
      var resp = JSON.parse(browser.text());
      if(typeof(resp) === 'object' && resp[0].uid && resp[0].points && resp[0].name && resp[0].photo) {
        done();
      }
    });
  });

  it('/top/friends', function(done){
    browser.visit("http://localhost:8001/top/friends", function () {    
      var resp = JSON.parse(browser.text());
      if(typeof(resp) === 'object' && resp[0].uid && resp[0].points && resp[0].name && resp[0].photo) {
        done();
      }
    });
  });

  it('/feed', function(done){
    browser.visit("http://localhost:8001/feed", function () {    
      var resp = JSON.parse(browser.text());
      // EXCEPT POINTS
      if(typeof(resp) === 'object' && resp[0].aid && resp[0].time && resp[0].uid && resp[0].aname && resp[0].description && resp[0].icon && resp[0].service && resp[0].name && resp[0].photo) {
        done();
      }
    });
  });

  it('/dashboard/latest', function(done){
    browser.visit("http://localhost:8001/dashboard/latest", function () {    
      var resp = JSON.parse(browser.text());
      // EXCEPT POINTS
      if(typeof(resp) === 'object' && resp[0].aid && resp[0].time && resp[0].name && resp[0].icon && resp[0].service) {
        done();
      }
    });
  });

  it('/dashboard/service_list', function(done){
    browser.visit("http://localhost:8001/dashboard/service_list", function () {    
      var resp = JSON.parse(browser.text());
      if(typeof(resp) === 'object' && resp[0].icon && resp[0].service && resp[0].type && resp[0].valid && resp[0].earnedPoints && resp[0].earned && resp[0].fullPoints && resp[0].full && resp[0].url) {
        done();
      }
    });
  });

});