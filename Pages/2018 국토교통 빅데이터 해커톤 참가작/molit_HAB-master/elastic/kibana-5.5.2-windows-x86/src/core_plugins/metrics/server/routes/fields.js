'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get_fields = require('../lib/get_fields');

var _get_fields2 = _interopRequireDefault(_get_fields);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = server => {

  server.route({
    path: '/api/metrics/fields',
    method: 'GET',
    handler: (req, reply) => {
      (0, _get_fields2.default)(req).then(reply).catch(err => {
        if (err.isBoom && err.status === 401) return reply(err);
        reply([]);
      });
    }
  });
};

module.exports = exports['default'];
