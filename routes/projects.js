'use strict';

module.exports = function (app) {

  app.get('/projects/', function (req, res) {
    log.info(new Date(), req.method, req.url);

    res.render('projects', {
      title: 'Projects'
    });
  });

};
