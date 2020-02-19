'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = handleResponseBody;

var _build_processor_function = require('./build_processor_function');

var _build_processor_function2 = _interopRequireDefault(_build_processor_function);

var _series = require('./response_processors/series');

var _series2 = _interopRequireDefault(_series);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function handleResponseBody(panel) {
  return resp => {
    if (resp.error) {
      const err = new Error(resp.error.type);
      err.response = JSON.stringify(resp);
      throw err;
    }
    const keys = Object.keys(resp.aggregations);
    if (keys.length !== 1) throw Error('There should only be one series per request.');
    const seriesId = keys[0];
    const series = panel.series.find(s => s.id === seriesId);
    const processor = (0, _build_processor_function2.default)(_series2.default, resp, panel, series);
    return processor([]);
  };
}
module.exports = exports['default'];
