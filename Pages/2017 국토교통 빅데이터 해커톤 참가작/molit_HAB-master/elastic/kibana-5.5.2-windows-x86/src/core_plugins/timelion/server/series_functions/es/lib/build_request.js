'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _create_date_agg = require('./create_date_agg');

var _create_date_agg2 = _interopRequireDefault(_create_date_agg);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function buildRequest(config, tlConfig) {

  const bool = { must: [], must_not: [] };

  const timeFilter = { range: {} };
  timeFilter.range[config.timefield] = { gte: tlConfig.time.from, lte: tlConfig.time.to, format: 'epoch_millis' };
  bool.must.push(timeFilter);

  // Use the kibana filter bar filters
  if (config.kibana) {
    bool.filter = _lodash2.default.get(tlConfig, 'request.payload.extended.es.filter') || {};
  }

  const aggs = {
    'q': {
      meta: { type: 'split' },
      filters: {
        filters: _lodash2.default.chain(config.q).map(function (q) {
          return [q, { query_string: { query: q } }];
        }).zipObject().value()
      },
      aggs: {}
    }
  };

  let aggCursor = aggs.q.aggs;

  _lodash2.default.each(config.split, function (clause) {
    clause = clause.split(':');
    if (clause[0] && clause[1]) {
      aggCursor[clause[0]] = {
        meta: { type: 'split' },
        terms: {
          field: clause[0],
          size: parseInt(clause[1], 10)
        },
        aggs: {}
      };
      aggCursor = aggCursor[clause[0]].aggs;
    } else {
      throw new Error('`split` requires field:limit');
    }
  });

  _lodash2.default.assign(aggCursor, (0, _create_date_agg2.default)(config, tlConfig));

  return {
    index: config.index,
    body: {
      query: {
        bool: bool
      },
      aggs: aggs,
      size: 0
    }
  };
};
