'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTestTimePatternRoute = undefined;

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createTestTimePatternRoute = exports.createTestTimePatternRoute = pre => ({
  path: '/api/index_patterns/_test_time_pattern',
  method: 'GET',
  config: {
    pre: [pre.getIndexPatternsService],
    validate: {
      query: _joi2.default.object().keys({
        pattern: _joi2.default.string().required()
      }).default()
    },
    handler(req, reply) {
      const indexPatterns = req.pre.indexPatterns;
      const pattern = req.query.pattern;


      reply(indexPatterns.testTimePattern({
        pattern
      }));
    }
  }
});
