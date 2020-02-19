'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _path = require('path');

var _deprecation = require('../../deprecation');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const extendInitFns = Symbol('extend plugin initialization');

const defaultConfigSchema = _joi2.default.object({
  enabled: _joi2.default.boolean().default(true)
}).default();

/**
 * The server plugin class, used to extend the server
 * and add custom behavior. A "scoped" plugin class is
 * created by the PluginApi class and provided to plugin
 * providers that automatically binds all but the `opts`
 * arguments.
 *
 * @class Plugin
 * @param {KbnServer} kbnServer - the KbnServer this plugin
 *                              belongs to.
 * @param {String} path - the path from which the plugin hails
 * @param {Object} pkg - the value of package.json for the plugin
 * @param {Objects} opts - the options for this plugin
 * @param {String} [opts.id=pkg.name] - the id for this plugin.
 * @param {Object} [opts.uiExports] - a mapping of UiExport types
 *                                  to UI modules or metadata about
 *                                  the UI module
 * @param {Array} [opts.require] - the other plugins that this plugin
 *                               requires. These plugins must exist and
 *                               be enabled for this plugin to function.
 *                               The require'd plugins will also be
 *                               initialized first, in order to make sure
 *                               that dependencies provided by these plugins
 *                               are available
 * @param {String} [opts.version=pkg.version] - the version of this plugin
 * @param {Function} [opts.init] - A function that will be called to initialize
 *                               this plugin at the appropriate time.
 * @param {Function} [opts.configPrefix=this.id] - The prefix to use for configuration
 *                               values in the main configuration service
 * @param {Function} [opts.config] - A function that produces a configuration
 *                                 schema using Joi, which is passed as its
 *                                 first argument.
 * @param {String|False} [opts.publicDir=path + '/public']
 *    - the public directory for this plugin. The final directory must
 *    have the name "public", though it can be located somewhere besides
 *    the root of the plugin. Set this to false to disable exposure of a
 *    public directory
 */
module.exports = class Plugin {
  constructor(kbnServer, path, pkg, opts) {
    this.kbnServer = kbnServer;
    this.pkg = pkg;
    this.path = path;

    this.id = opts.id || pkg.name;
    this.uiExportsSpecs = opts.uiExports || {};
    this.requiredIds = opts.require || [];
    this.version = opts.version || pkg.version;

    // Plugins must specify their version, and by default that version should match
    // the version of kibana down to the patch level. If these two versions need
    // to diverge, they can specify a kibana.version in the package to indicate the
    // version of kibana the plugin is intended to work with.
    this.kibanaVersion = opts.kibanaVersion || _lodash2.default.get(pkg, 'kibana.version', this.version);
    this.externalPreInit = opts.preInit || _lodash2.default.noop;
    this.externalInit = opts.init || _lodash2.default.noop;
    this.configPrefix = opts.configPrefix || this.id;
    this.getExternalConfigSchema = opts.config || _lodash2.default.noop;
    this.getExternalDeprecations = opts.deprecations || _lodash2.default.noop;
    this.preInit = _lodash2.default.once(this.preInit);
    this.init = _lodash2.default.once(this.init);
    this[extendInitFns] = [];

    if (opts.publicDir === false) {
      this.publicDir = null;
    } else if (!opts.publicDir) {
      this.publicDir = (0, _path.resolve)(this.path, 'public');
    } else {
      this.publicDir = opts.publicDir;
      if ((0, _path.basename)(this.publicDir) !== 'public') {
        throw new Error(`publicDir for plugin ${this.id} must end with a "public" directory.`);
      }
    }
  }

  static scoped(kbnServer, path, pkg) {
    return class ScopedPlugin extends Plugin {
      constructor(opts) {
        super(kbnServer, path, pkg, opts || {});
      }
    };
  }

  getConfigSchema() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const schema = yield _this.getExternalConfigSchema(_joi2.default);
      return schema || defaultConfigSchema;
    })();
  }

  getDeprecations() {
    const rules = this.getExternalDeprecations(_deprecation.Deprecations);
    return rules || [];
  }

  preInit() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      return yield _this2.externalPreInit(_this2.kbnServer.server);
    })();
  }

  init() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      const id = _this3.id,
            version = _this3.version,
            kbnServer = _this3.kbnServer,
            configPrefix = _this3.configPrefix;
      const config = kbnServer.config;

      // setup the hapi register function and get on with it

      const asyncRegister = (() => {
        var _ref = _asyncToGenerator(function* (server, options) {
          _this3.server = server;

          yield Promise.all(_this3[extendInitFns].map((() => {
            var _ref2 = _asyncToGenerator(function* (fn) {
              yield fn.call(_this3, server, options);
            });

            return function (_x3) {
              return _ref2.apply(this, arguments);
            };
          })()));

          server.log(['plugins', 'debug'], {
            tmpl: 'Initializing plugin <%= plugin.toString() %>',
            plugin: _this3
          });

          if (_this3.publicDir) {
            server.exposeStaticDir(`/plugins/${id}/{path*}`, _this3.publicDir);
          }

          // Many of the plugins are simply adding static assets to the server and we don't need
          // to track their "status". Since plugins must have an init() function to even set its status
          // we shouldn't even create a status unless the plugin can use it.
          if (_this3.externalInit !== _lodash2.default.noop) {
            _this3.status = kbnServer.status.createForPlugin(_this3);
            server.expose('status', _this3.status);
          }

          return yield (0, _bluebird.attempt)(_this3.externalInit, [server, options], _this3);
        });

        return function asyncRegister(_x, _x2) {
          return _ref.apply(this, arguments);
        };
      })();

      const register = function register(server, options, next) {
        _bluebird2.default.resolve(asyncRegister(server, options)).nodeify(next);
      };

      register.attributes = { name: id, version: version };

      yield (0, _bluebird.fromNode)(function (cb) {
        kbnServer.server.register({
          register: register,
          options: config.has(configPrefix) ? config.get(configPrefix) : null
        }, cb);
      });

      // Only change the plugin status to green if the
      // intial status has not been changed
      if (_this3.status && _this3.status.state === 'uninitialized') {
        _this3.status.green('Ready');
      }
    })();
  }

  extendInit(fn) {
    this[extendInitFns].push(fn);
  }

  toJSON() {
    return this.pkg;
  }

  toString() {
    return `${this.id}@${this.version}`;
  }
};
