'use strict';

var _reduce = require('../lib/reduce.js');

var _reduce2 = _interopRequireDefault(_reduce);

var _alter = require('../lib/alter.js');

var _alter2 = _interopRequireDefault(_alter);

var _chainable = require('../lib/classes/chainable');

var _chainable2 = _interopRequireDefault(_chainable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = new _chainable2.default('precision', {
  args: [{
    name: 'inputSeries',
    types: ['seriesList']
  }, {
    name: 'precision',
    types: ['number'],
    help: 'Number of digits to round each value to'
  }],
  help: 'number of digits to round the decimal portion of the value to',
  fn: function precisionFn(args) {
    (0, _alter2.default)(args, function (eachSeries, precision) {
      eachSeries._meta = eachSeries._meta || {};
      eachSeries._meta.precision = precision;
      return eachSeries;
    });

    return (0, _reduce2.default)(args, function (a, b) {
      return parseInt(a * Math.pow(10, b), 10) / Math.pow(10, b);
    });
  }
});
