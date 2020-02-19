'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ratios;

var _bucket_transform = require('../../helpers/bucket_transform');

var _bucket_transform2 = _interopRequireDefault(_bucket_transform);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint max-len:0 */
const filter = metric => metric.type === 'filter_ratio';
function ratios(req, panel, series) {
  return () => doc => {
    if (series.metrics.some(filter)) {
      series.metrics.filter(filter).forEach(metric => {
        _lodash2.default.set(doc, `aggs.${series.id}.aggs.timeseries.aggs.${metric.id}-numerator.filter`, {
          query_string: { query: metric.numerator || '*', analyze_wildcard: true }
        });
        _lodash2.default.set(doc, `aggs.${series.id}.aggs.timeseries.aggs.${metric.id}-denominator.filter`, {
          query_string: { query: metric.denominator || '*', analyze_wildcard: true }
        });

        let numeratorPath = `${metric.id}-numerator>_count`;
        let denominatorPath = `${metric.id}-denominator>_count`;

        if (metric.metric_agg !== 'count' && _bucket_transform2.default[metric.metric_agg]) {
          const aggBody = {
            metric: _bucket_transform2.default[metric.metric_agg]({
              type: metric.metric_agg,
              field: metric.field
            })
          };
          _lodash2.default.set(doc, `aggs.${series.id}.aggs.timeseries.aggs.${metric.id}-numerator.aggs`, aggBody);
          _lodash2.default.set(doc, `aggs.${series.id}.aggs.timeseries.aggs.${metric.id}-denominator.aggs`, aggBody);
          numeratorPath = `${metric.id}-numerator>metric`;
          denominatorPath = `${metric.id}-denominator>metric`;
        }

        _lodash2.default.set(doc, `aggs.${series.id}.aggs.timeseries.aggs.${metric.id}`, {
          bucket_script: {
            buckets_path: {
              numerator: numeratorPath,
              denominator: denominatorPath
            },
            script: 'params.numerator != null && params.denominator != null && params.denominator > 0 ? params.numerator / params.denominator : 0'
          }
        });
      });
    }
    return doc;
  };
}
module.exports = exports['default'];
