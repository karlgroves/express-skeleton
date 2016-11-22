'use strict';
var handlebars = require('handlebars');

handlebars.registerHelper('link', function(label, path) {
  label = handlebars.Utils.escapeExpression(label);
  path  = handlebars.Utils.escapeExpression(path);
  
  var result = '<li><a href="' + path + '">' + label + '</a></li>';

  return new handlebars.SafeString(result);
});
