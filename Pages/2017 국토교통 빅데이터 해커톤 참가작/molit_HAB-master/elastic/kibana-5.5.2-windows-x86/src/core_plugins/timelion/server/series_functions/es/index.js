'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _datasource = require('../../lib/classes/datasource');

var _datasource2 = _interopRequireDefault(_datasource);

var _build_request = require('./lib/build_request');

var _build_request2 = _interopRequireDefault(_build_request);

var _agg_response_to_series_list = require('./lib/agg_response_to_series_list');

var _agg_response_to_series_list2 = _interopRequireDefault(_agg_response_to_series_list);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = new _datasource2.default('es', {
  args: [{
    name: 'q',
    types: ['string', 'null'],
    multi: true,
    help: 'Query in lucene query string syntax'
  }, {
    name: 'metric',
    types: ['string', 'null'],
    multi: true,
    help: 'An elasticsearch single value metric agg, eg avg, sum, min, max or cardinality, followed by a field.' + ' Eg "sum:bytes", or just "count"'
  }, {
    name: 'split',
    types: ['string', 'null'],
    multi: true,
    help: 'An elasticsearch field to split the series on and a limit. Eg, "hostname:10" to get the top 10 hostnames'
  }, {
    name: 'index',
    types: ['string', 'null'],
    help: 'Index to query, wildcards accepted'
  }, {
    name: 'timefield',
    types: ['string', 'null'],
    help: 'Field of type "date" to use for x-axis'
  }, {
    name: 'kibana',
    types: ['boolean', 'null'],
    help: 'Respect filters on Kibana dashboards. Only has an effect when using on Kibana dashboards'
  }, {
    name: 'interval', // You really shouldn't use this, use the interval picker instead
    types: ['string', 'null'],
    help: '**DO NOT USE THIS**. Its fun for debugging fit functions, but you really should use the interval picker'
  }],
  help: 'Pull data from an elasticsearch instance',
  aliases: ['elasticsearch'],
  fn: function esFn(args, tlConfig) {

    const config = _lodash2.default.defaults(_lodash2.default.clone(args.byName), {
      q: '*',
      metric: ['count'],
      index: tlConfig.settings['timelion:es.default_index'],
      timefield: tlConfig.settings['timelion:es.timefield'],
      interval: tlConfig.time.interval,
      kibana: true,
      fit: 'nearest'
    });

    var _tlConfig$server$plug = tlConfig.server.plugins.elasticsearch.getCluster('data');

    const callWithRequest = _tlConfig$server$plug.callWithRequest;


    const body = (0, _build_request2.default)(config, tlConfig);

    return callWithRequest(tlConfig.request, 'search', body).then(function (resp) {
      if (!resp._shards.total) throw new Error('Elasticsearch index not found: ' + config.index);
      return {
        type: 'seriesList',
        list: (0, _agg_response_to_series_list2.default)(resp.aggregations, config)
      };
    });
  }
});
