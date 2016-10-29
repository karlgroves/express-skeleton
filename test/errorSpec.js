'use strict';

var assert = require('assert');

describe('Login', function () {

  beforeEach(function () {
    browser.url('http://localhost:3000/foobarbatbaz');
    browser.pause(500);
  });

  it('should have "404 - Not Found" as the page title', function () {
    var title = browser.getTitle();
    assert(title === '404 - Not Found');
  });


});
