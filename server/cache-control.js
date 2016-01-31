'use strict';

var serveStatic = require('serve-static');

module.exports = function (res, path) {
  var mime = serveStatic.mime.lookup(path);

  if (path.indexOf('node_modules') > 0)
    res.setHeader('Cache-Control', 'public, max-age=86400');

  else if (mime === 'application/javascript')
    res.setHeader('Cache-Control', 'public, max-age=5');

  else
    res.setHeader('Cache-Control', 'public, max-age=86400');
};