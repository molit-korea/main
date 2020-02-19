'use strict';

var _alter = require('../lib/alter.js');

var _alter2 = _interopRequireDefault(_alter);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _chainable = require('../lib/classes/chainable');

var _chainable2 = _interopRequireDefault(_chainable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = new _chainable2.default('points', {
  args: [{
    name: 'inputSeries',
    types: ['seriesList']
  }, {
    name: 'radius',
    types: ['number', 'null'],
    help: 'Size of points'
  }, {
    name: 'weight',
    types: ['number', 'null'],
    help: 'Thickness of line around point'
  }, {
    name: 'fill',
    types: ['number', 'null'],
    help: 'Number between 0 and 10 representing opacity of fill'
  }, {
    name: 'fillColor',
    types: ['string', 'null'],
    help: 'Color with which to fill point'
  }, {
    name: 'symbol',
    help: 'cross, circle, triangle, square or diamond',
    types: ['string', 'null']
  }, {
    name: 'show',
    types: ['boolean', 'null'],
    help: 'Show points or not'
  }],
  help: 'Show the series as points',
  fn: function pointsFn(args) {
    return (0, _alter2.default)(args, function (eachSeries, radius, weight, fill, fillColor, symbol, show) {
      eachSeries.points = eachSeries.points || {};
      eachSeries.points.radius = radius == null ? undefined : radius;

      if (fill) {
        eachSeries.points.fillColor = fillColor == null ? false : fillColor;
      }

      if (fill != null) {
        eachSeries.points.fill = fill / 10;
      }

      if (weight != null) {
        eachSeries.points.lineWidth = weight;
      }

      symbol = symbol || 'circle';
      const validSymbols = ['triangle', 'cross', 'square', 'diamond', 'circle'];
      if (!_lodash2.default.contains(['triangle', 'cross', 'square', 'diamond', 'circle'], symbol)) {
        throw new Error('Valid symbols are: ' + validSymbols.join(', '));
      }

      eachSeries.points.symbol = symbol;

      eachSeries.points.show = show == null ? true : show;

      return eachSeries;
    });
  }
});
