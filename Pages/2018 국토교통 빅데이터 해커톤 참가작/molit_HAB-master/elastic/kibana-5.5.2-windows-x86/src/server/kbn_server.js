'use strict';

var _lodash = require('lodash');

var _bluebird = require('bluebird');

var _cluster = require('cluster');

var _utils = require('../utils');

var _config = require('./config/config');

var _config2 = _interopRequireDefault(_config);

var _configuration = require('./logging/configuration');

var _configuration2 = _interopRequireDefault(_configuration);

var _setup = require('./config/setup');

var _setup2 = _interopRequireDefault(_setup);

var _http = require('./http');

var _http2 = _interopRequireDefault(_http);

var _logging = require('./logging');

var _logging2 = _interopRequireDefault(_logging);

var _warnings = require('./warnings');

var _warnings2 = _interopRequireDefault(_warnings);

var _status = require('./status');

var _status2 = _interopRequireDefault(_status);

var _pid = require('./pid');

var _pid2 = _interopRequireDefault(_pid);

var _scan = require('./plugins/scan');

var _scan2 = _interopRequireDefault(_scan);

var _check_enabled = require('./plugins/check_enabled');

var _check_enabled2 = _interopRequireDefault(_check_enabled);

var _check_version = require('./plugins/check_version');

var _check_version2 = _interopRequireDefault(_check_version);

var _complete = require('./config/complete');

var _complete2 = _interopRequireDefault(_complete);

var _ui = require('../ui');

var _ui2 = _interopRequireDefault(_ui);

var _optimize = require('../optimize');

var _optimize2 = _interopRequireDefault(_optimize);

var _initialize = require('./plugins/initialize');

var _initialize2 = _interopRequireDefault(_initialize);

var _index_patterns = require('./index_patterns');

var _saved_objects = require('./saved_objects');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const rootDir = (0, _utils.fromRoot)('.');

module.exports = class KbnServer {
  constructor(settings) {
    this.name = _utils.pkg.name;
    this.version = _utils.pkg.version;
    this.build = _utils.pkg.build || false;
    this.rootDir = rootDir;
    this.settings = settings || {};

    this.ready = (0, _lodash.constant)(this.mixin(
    // sets this.config, reads this.settings
    _setup2.default,
    // sets this.server
    _http2.default, _logging2.default, _warnings2.default, _status2.default,

    // writes pid file
    _pid2.default,

    // find plugins and set this.plugins
    _scan2.default,

    // disable the plugins that are disabled through configuration
    _check_enabled2.default,

    // disable the plugins that are incompatible with the current version of Kibana
    _check_version2.default,

    // tell the config we are done loading plugins
    _complete2.default,

    // setup this.uiExports and this.bundles
    _ui2.default, _index_patterns.indexPatternsMixin,

    // setup saved object routes
    _saved_objects.savedObjectsMixin,

    // setup server.uiSettings
    _ui.uiSettingsMixin,

    // ensure that all bundles are built, or that the
    // lazy bundle server is running
    _optimize2.default,

    // finally, initialize the plugins
    _initialize2.default, () => {
      if (this.config.get('server.autoListen')) {
        this.ready = (0, _lodash.constant)((0, _bluebird.resolve)());
        return this.listen();
      }
    }));

    this.listen = (0, _lodash.once)(this.listen);
  }

  /**
   * Extend the KbnServer outside of the constraits of a plugin. This allows access
   * to APIs that are not exposed (intentionally) to the plugins and should only
   * be used when the code will be kept up to date with Kibana.
   *
   * @param {...function} - functions that should be called to mixin functionality.
   *                         They are called with the arguments (kibana, server, config)
   *                         and can return a promise to delay execution of the next mixin
   * @return {Promise} - promise that is resolved when the final mixin completes.
   */
  mixin(...fns) {
    var _this = this;

    return _asyncToGenerator(function* () {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _lodash.compact)((0, _lodash.flatten)(fns))[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          const fn = _step.value;

          yield fn.call(_this, _this, _this.server, _this.config);
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

  /**
   * Tell the server to listen for incoming requests, or get
   * a promise that will be resolved once the server is listening.
   *
   * @return undefined
   */
  listen() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const server = _this2.server;


      yield _this2.ready();
      yield (0, _bluebird.fromNode)(function (cb) {
        return server.start(cb);
      });

      if (_cluster.isWorker) {
        // help parent process know when we are ready
        process.send(['WORKER_LISTENING']);
      }

      server.log(['listening', 'info'], `Server running at ${server.info.uri}`);
      return server;
    })();
  }

  close() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      yield (0, _bluebird.fromNode)(function (cb) {
        return _this3.server.stop(cb);
      });
    })();
  }

  inject(opts) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      if (!_this4.server) yield _this4.ready();

      return yield (0, _bluebird.fromNode)(function (cb) {
        try {
          _this4.server.inject(opts, function (resp) {
            cb(null, resp);
          });
        } catch (err) {
          cb(err);
        }
      });
    })();
  }

  applyLoggingConfiguration(settings) {
    const config = _config2.default.withDefaultSchema(settings);
    const loggingOptions = (0, _configuration2.default)(config);
    const subset = {
      ops: config.get('ops'),
      logging: config.get('logging')
    };
    const plain = JSON.stringify(subset, null, 2);
    this.server.log(['info', 'config'], 'New logging configuration:\n' + plain);
    this.server.plugins['even-better'].monitor.reconfigure(loggingOptions);
  }
};
