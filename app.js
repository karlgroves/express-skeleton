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
  helmet = require('helmet'),
  csrf = require('csurf');

var FileStore = require('session-file-store')(session);
require('./lib/logging')(config);

var app = express();
app.set('port', process.env.PORT || 3000);
app.set('trust proxy', 1);
app.use(helmet());
app.use(csrf());

app.use(function(req, res, next){
  // Expose variable to templates via locals
  res.locals.csrftoken = req.csrfToken();
  next();
});

app.use(session({
  store: new FileStore({
    encrypt: true
  }),
  secret: pkg.name,
  key: pkg.name + 'SessionId',
  resave: false,
  saveUninitialized: true,
  genid: function () {
    return uuid.v4();
  },
  cookie: {
    secure: true,
    httpOnly: true,
    // Cookie will expire in 1 hour from when it's generated
    expires: new Date( Date.now() + 60 * 60 * 1000 )
  }
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

// Include the routes file
require('./routes')(app);

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
