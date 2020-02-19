'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _build_target = require('../../lib/build_target.js');

var _build_target2 = _interopRequireDefault(_build_target);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (setup) {
  let targetSeries;

  let tlConfig = {
    getTargetSeries: function getTargetSeries() {
      return _lodash2.default.map(targetSeries, function (bucket) {
        // eslint-disable-line no-use-before-define
        return [bucket, null];
      });
    },
    setTargetSeries: function setTargetSeries() {
      targetSeries = (0, _build_target2.default)(this);
    },
    writeTargetSeries: function writeTargetSeries(series) {
      targetSeries = _lodash2.default.map(series, function (p) {
        return p[0];
      });
    }
  };

  tlConfig = _lodash2.default.extend(tlConfig, setup);
  return tlConfig;
};
