'use strict';

// had enabled by egg
// exports.static = true;

exports.ejs = {
  enable: true,
  package: 'egg-view-ejs',
};

exports.nunjucks = {
  enable: true,
  package: 'egg-view-nunjucks',
};
exports.mongoose = {
  enable: true,
  package: 'egg-mongoose',
};

exports.redis = {
  enable: false,
  package: 'egg-redis',
};
