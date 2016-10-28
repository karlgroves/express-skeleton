'use strict';
var application_root = __dirname,
  pkg = require('./package.json'),
  config = require('./config.json'),
  path = require('path'),
  fs = require('fs'),
  uuid = require('node-uuid'),
  express = require('express'),
  exphbs = require('express-handlebars'),
  favicon = require('serve-favicon'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  form = require('express-form'),
  field = form.field,
  filter = form.filter;

var FileStore = require('session-file-store')(session);
require('./lib/logging')(config);

var app = express();
app.set('port', process.env.PORT || 3000);
app.set('trust proxy', 1);

app.use(session({
  store: new FileStore({
    encrypt: true
  }),
  secret: pkg.name,
  resave: false,
  saveUninitialized: true,
  genid: function () {
    return uuid.v4();
  },
  cookie: {secure: true}
}));

app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  layoutsDir: 'views/layouts/',
  partialsDir: 'views/partials/',
}));

app.set('view engine', 'handlebars');
app.set('views', path.join(application_root, 'views'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json()); // support json encoded bodies
app.use(express.static(path.join(application_root, 'public')));


app.get('/', function (req, res) {
  log.info(new Date(), req.method, req.url);

  if (req.session.authorized === true) {
    return res.redirect('/projects');
  }

  res.render('index', {
    title: 'Login'
  });
});

// Handle the login
app.post('/',

  // Form filter and validation middleware
  form(
    field('password').trim().required(),
    field('email').trim().required().isEmail()
  ),

  // Express request-handler now receives filtered and validated data
  function (req, res) {
    log.info(new Date(), req.method, req.url);
    var sess = req.session;

    if (!req.form.isValid) {

      console.log(typeof req.form.errors);

      // Handle errors
      var eListHTML = '',
        eList = req.form.errors,
        eLength = eList.length;

      eListHTML += '<p>There are ' + eLength + ' errors preventing successful submission of this form:</p>';
      eListHTML += '<ul>';

      for (var i in eList) {
        if (eList.hasOwnProperty(i)) {
          eListHTML += '<li>' + eList[i] + '</li>';
        }
      }

      eListHTML += '</ul>';

      res.render('index', {
        title: 'Login',
        formErrors: eListHTML,
        email: req.form.email
      });

    } else {
      console.log('Password:', req.form.password);
      console.log('Email:', req.form.email);

      sess.email = req.form.email;
      sess.password = req.form.password;
      sess.authorized = true;

      return res.redirect('/projects');
    }
  }
);

app.get('/projects/', function (req, res) {
  log.info(new Date(), req.method, req.url);

  res.render('projects', {
    title: 'Projects'
  });
});


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


var server = app.listen(app.get('port'), function (err, res) {
  var host = server.address().address;
  var port = server.address().port;

  if (err) {
    log.error(err);
  }
  else {
    log.info('%s listening at http://%s:%s', pkg.name, host, port);
    console.log('Go to Heaven for the climate, Hell for the company ~ Mark Twain');
  }
});
