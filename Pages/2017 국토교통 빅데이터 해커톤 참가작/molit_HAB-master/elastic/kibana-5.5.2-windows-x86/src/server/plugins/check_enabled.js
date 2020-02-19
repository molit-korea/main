'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toPath = require('lodash/internal/toPath');

var _toPath2 = _interopRequireDefault(_toPath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = (() => {
  var _ref = _asyncToGenerator(function* (kbnServer, server, config) {
    const forcedOverride = {
      console: function console(enabledInConfig) {
        return !config.get('elasticsearch.tribe.url') && enabledInConfig;
      }
    };

    const plugins = kbnServer.plugins;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {

      for (var _iterator = plugins[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        const plugin = _step.value;

        const enabledInConfig = config.get([...(0, _toPath2.default)(plugin.configPrefix), 'enabled']);
        const hasOveride = forcedOverride.hasOwnProperty(plugin.id);
        if (hasOveride) {
          if (!forcedOverride[plugin.id](enabledInConfig)) {
            plugins.disable(plugin);
          }
        } else if (!enabledInConfig) {
          plugins.disable(plugin);
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return;
  });

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
})();

module.exports = exports['default'];
