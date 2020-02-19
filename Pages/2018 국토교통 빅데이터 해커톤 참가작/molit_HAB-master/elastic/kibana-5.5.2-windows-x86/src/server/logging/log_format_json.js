'use strict';

var _log_format = require('./log_format');

var _log_format2 = _interopRequireDefault(_log_format);

var _jsonStringifySafe = require('json-stringify-safe');

var _jsonStringifySafe2 = _interopRequireDefault(_jsonStringifySafe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const stripColors = function stripColors(string) {
  return string.replace(/\u001b[^m]+m/g, '');
};

module.exports = class KbnLoggerJsonFormat extends _log_format2.default {
  format(data) {
    data.message = stripColors(data.message);
    return (0, _jsonStringifySafe2.default)(data);
  }
};
