'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _chainable = require('../../lib/classes/chainable');

var _chainable2 = _interopRequireDefault(_chainable);

var _regress = require('./lib/regress');

var regress = _interopRequireWildcard(_regress);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const validRegressions = {
  linear: 'linear',
  log: 'logarithmic'
};

module.exports = new _chainable2.default('trend', {
  args: [{
    name: 'inputSeries',
    types: ['seriesList']
  }, {
    name: 'mode',
    types: ['string'],
    help: 'The algorithm to use for generating the trend line. One of: ' + _lodash2.default.keys(validRegressions).join(', ')
  }, {
    name: 'start',
    types: ['number', 'null'],
    help: 'Where to start calculating from the beginning or end. For example -10 would start calculating 10 points from' + ' the end, +15 would start 15 points from the beginning. Default: 0'
  }, {
    name: 'end',
    types: ['number', 'null'],
    help: 'Where to stop calculating from the beginning or end. For example -10 would stop calculating 10 points from' + ' the end, +15 would stop 15 points from the beginning. Default: 0'
  }],
  help: 'Draws a trend line using a specified regression algorithm',
  fn: function absFn(args) {
    const newSeries = _lodash2.default.cloneDeep(args.byName.inputSeries);

    _lodash2.default.each(newSeries.list, function (series) {
      const length = series.data.length;
      let start = args.byName.start == null ? 0 : args.byName.start;
      let end = args.byName.end == null ? length : args.byName.end;
      start = start >= 0 ? start : length + start;
      end = end > 0 ? end : length + end;

      const subset = series.data.slice(start, end);

      const result = regress[args.byName.mode || 'linear'](subset);

      _lodash2.default.each(series.data, function (point) {
        point[1] = null;
      });

      _lodash2.default.each(result, function (point, i) {
        series.data[start + i] = point;
      });
    });
    return newSeries;
  }
});
