'use strict';

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _transform_deprecations = require('./transform_deprecations');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (kbnServer) {
  const settings = (0, _transform_deprecations.transformDeprecations)(kbnServer.settings);
  kbnServer.config = _config2.default.withDefaultSchema(settings);
};
