'use strict';

var _alter = require('../lib/alter.js');

var _alter2 = _interopRequireDefault(_alter);

var _chainable = require('../lib/classes/chainable');

var _chainable2 = _interopRequireDefault(_chainable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = new _chainable2.default('legend', {
  args: [{
    name: 'inputSeries',
    types: ['seriesList']
  }, {
    name: 'position',
    types: ['string', 'boolean', 'null'],
    help: 'Corner to place the legend in: nw, ne, se, or sw. You can also pass false to disable the legend'
  }, {
    name: 'columns',
    types: ['number', 'null'],
    help: 'Number of columns to divide the legend into'
  }],
  help: 'Set the position and style of the legend on the plot',
  fn: function legendFn(args) {
    return (0, _alter2.default)(args, function (eachSeries, position, columns) {
      eachSeries._global = eachSeries._global || {};
      eachSeries._global.legend = eachSeries._global.legend || {};
      eachSeries._global.legend.noColumns = columns;

      if (position === false) {
        eachSeries._global.legend.show = false;
      } else {
        eachSeries._global.legend.position = position;
      }

      return eachSeries;
    });
  }
});
