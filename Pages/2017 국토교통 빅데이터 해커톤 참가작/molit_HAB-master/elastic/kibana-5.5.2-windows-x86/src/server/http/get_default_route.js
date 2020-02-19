'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _lodash2.default.once(function (kbnServer) {
  const config = kbnServer.config;

  return `${config.get('server.basePath')}${config.get('server.defaultRoute')}`;
});
