'use strict';

module.exports = function (app) {
  var form = require('express-form'),
    field = form.field,
    config = require('../config.json');


  app.get('/', function (req, res) {
    log.info(new Date(), req.method, req.url);

    if (req.session.authorized === true) {
      return res.redirect(config.loginLocation);
    }

    res.render('index', {
      title: 'Login',
      mainHeading: 'Login'
    });
  });

  // Handle the login
  app.post('/',

    // Form filter and validation middleware
    form(
      field('password').trim().required(),
      field('email').trim().toLowerCase().required().isEmail()
    ),

    // Express request-handler now receives filtered and validated data
    function (req, res) {
      log.info(new Date(), req.method, req.url);
      var sess = req.session;

      if (!req.form.isValid) {

        // Handle errors
        var eListHTML = '',
          eList = req.form.errors,
          eLength = eList.length;

        eListHTML += '<p>There are ' + eLength + ' errors preventing login:</p>';
        eListHTML += '<ol>';

        for (var i in eList) {
          if (eList.hasOwnProperty(i)) {
            eListHTML += '<li>' + eList[i] + '</li>';
          }
        }

        eListHTML += '</ol>';

        res.render('index', {
          title: 'Login: There are ' + eLength + ' errors preventing login',
          mainHeading: 'Login',
          formErrors: eListHTML,
          email: req.form.email,
          emailError: req.form.getErrors('email'),
          pwError: req.form.getErrors('password')
        });

      } else {
        sess.email = req.form.email;
        sess.password = req.form.password;
        sess.authorized = true;

        return res.redirect(config.loginLocation);
      }
    }
  );


  // Handle logout. Destroy session and redirect back to login page
  app.get('/logout', function (req, res) {
    log.info(new Date(), req.method, req.url);

    req.session.destroy(function (err) {
      if (err) {
        log.error(err);
      }
      else {
        log.info('User logged out.');
      }
    });
    return res.redirect('/');
  });


};
