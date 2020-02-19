'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _version = require('../../utils/version');

var _lodash = require('lodash');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function compatibleWithKibana(kbnServer, plugin) {
  //core plugins have a version of 'kibana' and are always compatible
  if (plugin.kibanaVersion === 'kibana') return true;

  const pluginKibanaVersion = (0, _version.cleanVersion)(plugin.kibanaVersion);
  const kibanaVersion = (0, _version.cleanVersion)(kbnServer.version);

  return (0, _version.versionSatisfies)(pluginKibanaVersion, kibanaVersion);
}

exports.default = (() => {
  var _ref = _asyncToGenerator(function* (kbnServer, server) {
    //because a plugin pack can contain more than one actual plugin, (for example x-pack)
    //we make sure that the warning messages are unique
    const warningMessages = new Set();
    const plugins = kbnServer.plugins;

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = plugins[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        const plugin = _step.value;

        const version = plugin.kibanaVersion;
        const name = (0, _lodash.get)(plugin, 'pkg.name');

        if (!compatibleWithKibana(kbnServer, plugin)) {
          const message = `Plugin "${name}" was disabled because it expected Kibana version "${version}", and found "${kbnServer.version}".`;
          warningMessages.add(message);
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

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = warningMessages[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        const message = _step2.value;

        server.log(['warning'], message);
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    return;
  });

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

module.exports = exports['default'];
