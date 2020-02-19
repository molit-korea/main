'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (dot, nestedObj, flattenArrays) {
  const stack = []; // track key stack
  const flatObj = {};
  (function flattenObj(obj) {
    _lodash2.default.keys(obj).forEach(function (key) {
      stack.push(key);
      if (!flattenArrays && _lodash2.default.isArray(obj[key])) flatObj[stack.join(dot)] = obj[key];else if (_lodash2.default.isObject(obj[key])) flattenObj(obj[key]);else flatObj[stack.join(dot)] = obj[key];
      stack.pop();
    });
  })(nestedObj);
  return flatObj;
};
