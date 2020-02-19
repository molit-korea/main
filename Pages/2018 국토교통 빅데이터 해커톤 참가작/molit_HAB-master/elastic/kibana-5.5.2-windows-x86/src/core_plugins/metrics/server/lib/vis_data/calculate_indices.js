'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _offset_time = require('./offset_time');

var _offset_time2 = _interopRequireDefault(_offset_time);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getParams(req, indexPattern, timeField, offsetBy) {
  var _offsetTime = (0, _offset_time2.default)(req, offsetBy);

  const from = _offsetTime.from,
        to = _offsetTime.to;


  const indexConstraints = {};
  indexConstraints[timeField] = {
    max_value: { gte: from.valueOf(), format: 'epoch_millis' },
    min_value: { lte: to.valueOf(), format: 'epoch_millis' }
  };

  return {
    index: indexPattern,
    level: 'indices',
    ignoreUnavailable: true,
    body: {
      fields: [timeField],
      index_constraints: indexConstraints
    }
  };
}

function handleResponse(indexPattern) {
  return resp => {
    const indices = _lodash2.default.map(resp.indices, (_info, index) => index);
    if (indices.length === 0) {
      // there are no relevant indices for the given timeframe in the data
      return [indexPattern];
    }
    return indices;
  };
}

function calculateIndices(req, indexPattern = '*', timeField = '@timestamp', offsetBy) {
  const server = req.server;

  var _server$plugins$elast = server.plugins.elasticsearch.getCluster('data');

  const callWithRequest = _server$plugins$elast.callWithRequest;

  const params = getParams(req, indexPattern, timeField, offsetBy);
  return callWithRequest(req, 'fieldStats', params).then(handleResponse(indexPattern));
}

calculateIndices.handleResponse = handleResponse;
calculateIndices.getParams = getParams;
exports.default = calculateIndices;
module.exports = exports['default'];
