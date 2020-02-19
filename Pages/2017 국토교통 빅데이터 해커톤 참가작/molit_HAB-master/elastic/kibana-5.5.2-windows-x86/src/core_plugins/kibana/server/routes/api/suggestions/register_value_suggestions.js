'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerValueSuggestions = registerValueSuggestions;

var _handle_es_error = require('../../../lib/handle_es_error');

var _handle_es_error2 = _interopRequireDefault(_handle_es_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function registerValueSuggestions(server) {
  server.route({
    path: '/api/kibana/suggestions/values/{index}',
    method: ['POST'],
    handler: function handler(req, reply) {
      const index = req.params.index;
      var _req$payload = req.payload;
      const field = _req$payload.field,
            query = _req$payload.query;

      var _server$plugins$elast = server.plugins.elasticsearch.getCluster('data');

      const callWithRequest = _server$plugins$elast.callWithRequest;

      const include = query ? `.*${query}.*` : undefined;
      const body = getBody({
        field,
        include,
        shard_size: 10,
        size: 10
      });

      return callWithRequest(req, 'search', { index, body }).then(res => {
        const suggestions = res.aggregations.suggestions.buckets.map(bucket => bucket.key);
        return reply(suggestions);
      }).catch(error => reply((0, _handle_es_error2.default)(error)));
    }
  });
}

function getBody(terms) {
  return {
    aggs: {
      suggestions: { terms }
    }
  };
}
