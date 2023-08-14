'use strict';

const application_root = __dirname;
const pkg = require('./package.json');
const config = require('./config.json');
const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const session = require('express-session');
const helmet = require('helmet');
const FileStore = require('session-file-store')(session);
const helpers = require('handlebars-helpers');
const uuid = require('uuid');
require("./lib/logging")(config);


const app = express();
const port = config.port;

app.set('trust proxy', 1);
app.use(helmet());

app.use(
  session({
    store: new FileStore({
      encrypt: true,
    }),
    secret: pkg.name,
    name: `${pkg.name}SessionId`,
    resave: false,
    saveUninitialized: true,
    genid: () => uuid.v4(),
    cookie: {
      secure: false,
      httpOnly: true,
      expires: new Date(Date.now() + 60 * 60 * 1000),
    },
  })
);

app.engine(
  'handlebars',
  exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(application_root, 'views/layouts/'),
    partialsDir: path.join(application_root, 'views/partials/'),
    helpers: helpers,
  })
);



app.set('view engine', 'handlebars');
app.set('views', path.join(application_root, 'views'));

app.use((req, res, next) => {
  res.locals.navOpts = [
    { path: '/foo', label: 'Foo' },
    { path: '/bar', label: 'Bar' },
    { path: '/bat', label: 'Bat' },
    { path: '/baz', label: 'Baz' },
  ];
  res.locals.isSignedIn = req.session.authorized;
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(application_root, 'public')));

// Include the routes file(s)
require('./routes')(app);

// Quick & Dirty 404 handling
app.use((req, res) => {
  res.render('error', {
    title: '404 - Not Found',
    message: 'The requested page was not found',
    curUrl: req.originalUrl,
  });
});

// Method Not Supported handlers
const methodNotSupportedHandler = (req, res) => {
  res.render('error', {
    title: '405 - Method Not Supported',
    message: `The ${req.method} method is not supported by this system`,
    curUrl: req.originalUrl,
  });
};

app.use('*', methodNotSupportedHandler);
app.delete('*', methodNotSupportedHandler);
app.put('*', methodNotSupportedHandler);
app.head('*', methodNotSupportedHandler);

app.listen(port, () => {
  console.log(`${pkg.name} listening at http://localhost:${port}`);
});
