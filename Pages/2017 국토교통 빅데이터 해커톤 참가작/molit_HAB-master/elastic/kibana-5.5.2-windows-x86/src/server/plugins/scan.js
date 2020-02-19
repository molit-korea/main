'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _fs = require('fs');

var _path = require('path');

var _plugin_collection = require('./plugin_collection');

var _plugin_collection2 = _interopRequireDefault(_plugin_collection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

module.exports = (() => {
  var _ref = _asyncToGenerator(function* (kbnServer, server, config) {

    const plugins = kbnServer.plugins = new _plugin_collection2.default(kbnServer);

    const scanDirs = [].concat(config.get('plugins.scanDirs') || []);
    const pluginPaths = [].concat(config.get('plugins.paths') || []);

    const debug = _lodash2.default.bindKey(server, 'log', ['plugins', 'debug']);
    const warning = _lodash2.default.bindKey(server, 'log', ['plugins', 'warning']);

    // scan all scanDirs to find pluginPaths
    yield (0, _bluebird.each)(scanDirs, (() => {
      var _ref2 = _asyncToGenerator(function* (dir) {
        debug({ tmpl: 'Scanning `<%= dir %>` for plugins', dir: dir });

        let filenames = null;

        try {
          filenames = yield (0, _bluebird.fromNode)(function (cb) {
            return (0, _fs.readdir)(dir, cb);
          });
        } catch (err) {
          if (err.code !== 'ENOENT') throw err;

          filenames = [];
          warning({
            tmpl: '<%= err.code %>: Unable to scan non-existent directory for plugins "<%= dir %>"',
            err: err,
            dir: dir
          });
        }

        yield (0, _bluebird.each)(filenames, (() => {
          var _ref3 = _asyncToGenerator(function* (name) {
            if (name[0] === '.') return;

            const path = (0, _path.resolve)(dir, name);
            const stats = yield (0, _bluebird.fromNode)(function (cb) {
              return (0, _fs.stat)(path, cb);
            });
            if (stats.isDirectory()) {
              pluginPaths.push(path);
            }
          });

          return function (_x5) {
            return _ref3.apply(this, arguments);
          };
        })());
      });

      return function (_x4) {
        return _ref2.apply(this, arguments);
      };
    })());

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = pluginPaths[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        const path = _step.value;

        let modulePath;
        try {
          modulePath = require.resolve(path);
        } catch (e) {
          warning({ tmpl: 'Skipping non-plugin directory at <%= path %>', path: path });
          continue;
        }

        yield plugins.new(path);
        debug({ tmpl: 'Found plugin at <%= path %>', path: modulePath });
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
  });

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
})();
