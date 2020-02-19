'use strict';

let addPluginConfig = (() => {
  var _ref = _asyncToGenerator(function* (pluginCollection, plugin) {
    var _pluginCollection$kbn = pluginCollection.kbnServer;
    const config = _pluginCollection$kbn.config,
          server = _pluginCollection$kbn.server,
          settings = _pluginCollection$kbn.settings;


    const transformedSettings = (0, _transform_deprecations.transformDeprecations)(settings);
    const pluginSettings = (0, _lodash.get)(transformedSettings, plugin.configPrefix);
    const deprecations = plugin.getDeprecations();
    const transformedPluginSettings = (0, _deprecation.createTransform)(deprecations)(pluginSettings, function (message) {
      server.log(['warning', plugin.configPrefix, 'config', 'deprecation'], message);
    });

    const configSchema = yield plugin.getConfigSchema();
    config.extendSchema(configSchema, transformedPluginSettings, plugin.configPrefix);
  });

  return function addPluginConfig(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

var _plugin_api = require('./plugin_api');

var _plugin_api2 = _interopRequireDefault(_plugin_api);

var _util = require('util');

var _lodash = require('lodash');

var _collection = require('../../utils/collection');

var _collection2 = _interopRequireDefault(_collection);

var _transform_deprecations = require('../config/transform_deprecations');

var _deprecation = require('../../deprecation');

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const byIdCache = Symbol('byIdCache');
const pluginApis = Symbol('pluginApis');

function disablePluginConfig(pluginCollection, plugin) {
  // when disabling a plugin's config we remove the existing schema and
  // replace it with a simple schema/config that only has enabled set to false
  const config = pluginCollection.kbnServer.config;

  config.removeSchema(plugin.configPrefix);
  const schema = _joi2.default.object({ enabled: _joi2.default.bool() });
  config.extendSchema(schema, { enabled: false }, plugin.configPrefix);
}

module.exports = class Plugins extends _collection2.default {

  constructor(kbnServer) {
    super();
    this.kbnServer = kbnServer;
    this[pluginApis] = new Set();
  }

  new(path) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const api = new _plugin_api2.default(_this.kbnServer, path);
      _this[pluginApis].add(api);

      const output = [].concat(require(path)(api) || []);

      if (!output.length) return;

      // clear the byIdCache
      _this[byIdCache] = null;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = output[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          const plugin = _step.value;

          if (!plugin instanceof api.Plugin) {
            throw new TypeError('unexpected plugin export ' + (0, _util.inspect)(plugin));
          }

          yield addPluginConfig(_this, plugin);
          _this.add(plugin);
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
    })();
  }

  disable(plugin) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      disablePluginConfig(_this2, plugin);
      _this2.delete(plugin);
    })();
  }

  get byId() {
    return this[byIdCache] || (this[byIdCache] = (0, _lodash.indexBy)([...this], 'id'));
  }

  getPluginApis() {
    return this[pluginApis];
  }

};
