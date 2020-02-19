'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _calculate_indices = require('./calculate_indices');

var _calculate_indices2 = _interopRequireDefault(_calculate_indices);

var _build_request_body = require('./build_request_body');

var _build_request_body2 = _interopRequireDefault(_build_request_body);

var _get_interval_and_timefield = require('./get_interval_and_timefield');

var _get_interval_and_timefield2 = _interopRequireDefault(_get_interval_and_timefield);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (req, panel, series) => {
  const indexPattern = series.override_index_pattern && series.series_index_pattern || panel.index_pattern;

  var _getIntervalAndTimefi = (0, _get_interval_and_timefield2.default)(panel, series);

  const timeField = _getIntervalAndTimefi.timeField;


  return (0, _calculate_indices2.default)(req, indexPattern, timeField, series.offset_time).then(indices => {
    const bodies = [];

    bodies.push({
      index: indices,
      ignore: [404],
      timeout: '90s',
      requestTimeout: 90000,
      ignoreUnavailable: true
    });

    bodies.push((0, _build_request_body2.default)(req, panel, series));
    return bodies;
  });
};

module.exports = exports['default'];
