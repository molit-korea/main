'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (kbnServer, server, config) {

  server.decorate('server', 'config', function () {
    return kbnServer.config;
  });

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = getUnusedSettings(kbnServer.settings, config.get())[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      const key = _step.value;

      server.log(['warning', 'config'], `Settings for "${key}" were not applied, check for spelling errors and ensure the plugin is loaded.`);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
};

var _lodash = require('lodash');

var _transform_deprecations = require('./transform_deprecations');

const getUnusedSettings = (settings, configValues) => {
  return (0, _lodash.difference)((0, _lodash.keys)((0, _transform_deprecations.transformDeprecations)(settings)), (0, _lodash.keys)(configValues));
};

module.exports = exports['default'];
