'use strict';

module.exports = function (app) {

  app.get('/projects', function (req, res) {
    log.info(new Date(), req.method, req.url);

    if (req.session.authorized !== true) {
      return res.redirect('/');
    }
    
    res.render('projects', {
      title: 'Projects',
      curUrl: req.originalUrl
    });
  });

};
