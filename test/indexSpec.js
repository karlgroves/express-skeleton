'use strict';

var assert = require('assert');

describe('Login', function () {

  beforeEach(function () {
    browser.url('http://localhost:3000/');
    browser.pause(500);
  });

  it('should have "Login" as the page title', function () {
    var title = browser.getTitle();
    assert(title === 'Login');
  });

  it('should log in', function () {
    browser.setValue('#email', 'me@example.com');
    var eValue = browser.getValue('#email');
    assert(eValue === 'me@example.com');

    browser.setValue('#password', 'XYZPDQ123!');
    var pValue = browser.getValue('#password');
    assert(pValue === 'XYZPDQ123!');

    browser.click('#submit');
    browser.pause(100);

    var title = browser.getTitle();
    assert(title === 'Projects');
  });
});
