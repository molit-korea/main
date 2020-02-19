'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = splitByTerm;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _basic_aggs = require('../../../../../common/basic_aggs');

var _basic_aggs2 = _interopRequireDefault(_basic_aggs);

var _get_bucket_size = require('../../helpers/get_bucket_size');

var _get_bucket_size2 = _interopRequireDefault(_get_bucket_size);

var _get_timerange = require('../../helpers/get_timerange');

var _get_timerange2 = _interopRequireDefault(_get_timerange);

var _get_interval_and_timefield = require('../../get_interval_and_timefield');

var _get_interval_and_timefield2 = _interopRequireDefault(_get_interval_and_timefield);

var _get_buckets_path = require('../../helpers/get_buckets_path');

var _get_buckets_path2 = _interopRequireDefault(_get_buckets_path);

var _bucket_transform = require('../../helpers/bucket_transform');

var _bucket_transform2 = _interopRequireDefault(_bucket_transform);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function splitByTerm(req, panel, series) {
  return next => doc => {
    if (series.split_mode === 'terms' && series.terms_field) {
      var _getIntervalAndTimefi = (0, _get_interval_and_timefield2.default)(panel, series);

      const timeField = _getIntervalAndTimefi.timeField,
            interval = _getIntervalAndTimefi.interval;

      var _getBucketSize = (0, _get_bucket_size2.default)(req, interval);

      const bucketSize = _getBucketSize.bucketSize;

      var _getTimerange = (0, _get_timerange2.default)(req);

      const to = _getTimerange.to;


      _lodash2.default.set(doc, `aggs.${series.id}.terms.field`, series.terms_field);
      _lodash2.default.set(doc, `aggs.${series.id}.terms.size`, series.terms_size);
      const metric = series.metrics.find(item => item.id === series.terms_order_by);
      if (metric && metric.type !== 'count' && ~_basic_aggs2.default.indexOf(metric.type)) {
        const sortAggKey = `${series.terms_order_by}-SORT`;
        const fn = _bucket_transform2.default[metric.type];
        const bucketPath = (0, _get_buckets_path2.default)(series.terms_order_by, series.metrics).replace(series.terms_order_by, `${sortAggKey} > SORT`);
        _lodash2.default.set(doc, `aggs.${series.id}.terms.order`, { [bucketPath]: 'desc' });
        _lodash2.default.set(doc, `aggs.${series.id}.aggs`, {
          [sortAggKey]: {
            filter: {
              range: {
                [timeField]: {
                  gte: to.valueOf() - bucketSize * 1500,
                  lte: to.valueOf(),
                  format: 'epoch_millis'
                }
              }
            },
            aggs: { SORT: fn(metric) }
          }
        });
      }
    }
    return next(doc);
  };
}
module.exports = exports['default'];
