'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = registerDelete;

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function registerDelete(server) {
  server.route({
    path: '/api/kibana/settings/{key}',
    method: 'DELETE',
    handler: function handler(req, reply) {
      const key = req.params.key;

      const uiSettings = server.uiSettings();
      uiSettings.remove(req, key).then(() => uiSettings.getUserProvided(req).then(settings => reply({ settings }).type('application/json'))).catch(err => reply(_boom2.default.wrap(err, err.statusCode)));
    }
  });
}
module.exports = exports['default'];
