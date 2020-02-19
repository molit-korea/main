'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function preProcessChainFn(tlConfig) {
  return function preProcessChain(chain, queries) {
    queries = queries || {};
    function validateAndStore(item) {
      if (_lodash2.default.isObject(item) && item.type === 'function') {
        const functionDef = tlConfig.server.plugins.timelion.getFunction(item.function);

        if (functionDef.datasource) {
          queries[functionDef.cacheKey(item)] = item;
          return true;
        }
        return false;
      }
    }

    // Is this thing a function?
    if (validateAndStore(chain)) {
      return;
    }

    if (!_lodash2.default.isArray(chain)) return;

    _lodash2.default.each(chain, function (operator) {
      if (!_lodash2.default.isObject(operator)) {
        return;
      }
      switch (operator.type) {
        case 'chain':
          preProcessChain(operator.chain, queries);
          break;
        case 'chainList':
          preProcessChain(operator.list, queries);
          break;
        case 'function':
          if (validateAndStore(operator)) {
            break;
          } else {
            preProcessChain(operator.arguments, queries);
          }
          break;
      }
    });

    return queries;
  };
};
