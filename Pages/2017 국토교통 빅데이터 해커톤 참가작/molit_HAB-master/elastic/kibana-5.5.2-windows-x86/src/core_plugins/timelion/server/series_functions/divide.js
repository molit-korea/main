'use strict';

var _reduce = require('../lib/reduce.js');

var _reduce2 = _interopRequireDefault(_reduce);

var _chainable = require('../lib/classes/chainable');

var _chainable2 = _interopRequireDefault(_chainable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = new _chainable2.default('divide', {
  args: [{
    name: 'inputSeries',
    types: ['seriesList']
  }, {
    name: 'divisor',
    types: ['seriesList', 'number'],
    help: 'Number or series to divide by. If passing a seriesList it must contain exactly 1 series.'
  }],
  help: 'Divides the values of one or more series in a seriesList to each position, in each series, of the input seriesList',
  fn: function divideFn(args) {
    return (0, _reduce2.default)(args, function (a, b) {
      return a / b;
    });
  }
});
