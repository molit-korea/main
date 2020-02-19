'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Reduces multiple arrays into a single array using a function
 * @param {Array} args - args[0] must always be a {type: 'seriesList'}
 *
 * - If only arg[0] exists, the seriesList will be reduced to a seriesList containing a single series
 * - If multiple arguments are passed, each argument will be mapped onto each series in the seriesList.

 * @params {Function} fn - Function used to combine points at same index in each array of each series in the seriesList.
 * @return {seriesList}
 */
module.exports = function reduce(args, fn) {
  return _bluebird2.default.all(args).then(function (args) {

    const seriesList = args.shift();
    let argument = args.shift();

    if (seriesList.type !== 'seriesList') {
      throw new Error('input must be a seriesList');
    }

    if (_lodash2.default.isObject(argument) && argument.type === 'seriesList') {
      if (argument.list.length !== 1) {
        throw new Error('argument must be a seriesList with a single series');
      } else {
        argument = argument.list[0];
      }
    }

    function reduceSeries(series) {
      return _lodash2.default.reduce(series, function (destinationObject, argument, i, p) {

        let output = _lodash2.default.map(destinationObject.data, function (point, index) {

          const value = point[1];

          if (value == null) {
            return [point[0], null];
          }

          if (_lodash2.default.isNumber(argument)) {
            return [point[0], fn(value, argument, i, p)];
          }

          if (argument.data[index] == null || argument.data[index][1] == null) {
            return [point[0], null];
          }
          return [point[0], fn(value, argument.data[index][1], i, p)];
        });

        // Output = single series

        output = {
          data: output
        };
        output = _lodash2.default.defaults(output, destinationObject);
        return output;
      });
    }

    let reduced;

    if (argument != null) {
      reduced = _lodash2.default.map(seriesList.list, function (series) {
        return reduceSeries([series].concat(argument));
      });
    } else {
      reduced = [reduceSeries(seriesList.list)];
    }

    seriesList.list = reduced;
    return seriesList;
  }).catch(function (e) {
    throw e;
  });
};
