'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (kbnServer, server) {
  (0, _transform_deprecations.transformDeprecations)(kbnServer.settings, message => {
    server.log(['warning', 'config', 'deprecation'], message);
  });
};

var _transform_deprecations = require('./transform_deprecations');

module.exports = exports['default'];
