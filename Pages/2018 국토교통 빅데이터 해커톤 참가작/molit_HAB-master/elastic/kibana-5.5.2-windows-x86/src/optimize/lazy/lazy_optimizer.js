'use strict';

var _base_optimizer = require('../base_optimizer');

var _base_optimizer2 = _interopRequireDefault(_base_optimizer);

var _weird_control_flow = require('./weird_control_flow');

var _weird_control_flow2 = _interopRequireDefault(_weird_control_flow);

var _lodash = require('lodash');

var _path = require('path');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

module.exports = class LazyOptimizer extends _base_optimizer2.default {
  constructor(opts) {
    super(opts);
    this.log = opts.log || (() => null);
    this.prebuild = opts.prebuild || false;

    this.timer = {
      ms: null,
      start: () => this.timer.ms = Date.now(),
      end: () => this.timer.ms = ((Date.now() - this.timer.ms) / 1000).toFixed(2)
    };

    this.build = new _weird_control_flow2.default();
  }

  init() {
    var _this = this;

    return _asyncToGenerator(function* () {
      _this.initializing = true;

      yield _this.bundles.writeEntryFiles();
      yield _this.initCompiler();

      _this.compiler.plugin('watch-run', function (w, webpackCb) {
        _this.build.work((0, _lodash.once)(function () {
          _this.timer.start();
          _this.logRunStart();
          webpackCb();
        }));
      });

      _this.compiler.plugin('done', function (stats) {
        if (!stats.hasErrors() && !stats.hasWarnings()) {
          _this.logRunSuccess();
          _this.build.success();
          return;
        }

        const err = _this.failedStatsToError(stats);
        _this.logRunFailure(err);
        _this.build.failure(err);
        _this.watching.invalidate();
      });

      _this.watching = _this.compiler.watch({ aggregateTimeout: 200 }, function (err) {
        if (err) {
          _this.log('fatal', err);
          process.exit(1);
        }
      });

      const buildPromise = _this.build.get();
      if (_this.prebuild) yield buildPromise;

      _this.initializing = false;
      _this.log(['info', 'optimize'], {
        tmpl: `Lazy optimization of ${_this.bundles.desc()} ready`,
        bundles: _this.bundles.getIds()
      });
    })();
  }

  getPath(relativePath) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      yield _this2.build.get();
      return (0, _path.join)(_this2.compiler.outputPath, relativePath);
    })();
  }

  bindToServer(server) {
    var _this3 = this;

    server.route({
      path: '/bundles/{asset*}',
      method: 'GET',
      handler: (() => {
        var _ref = _asyncToGenerator(function* (request, reply) {
          try {
            const path = yield _this3.getPath(request.params.asset);
            return reply.file(path);
          } catch (error) {
            console.log(error.stack);
            return reply(error);
          }
        });

        return function handler(_x, _x2) {
          return _ref.apply(this, arguments);
        };
      })()
    });
  }

  logRunStart() {
    this.log(['info', 'optimize'], {
      tmpl: `Lazy optimization started`,
      bundles: this.bundles.getIds()
    });
  }

  logRunSuccess() {
    this.log(['info', 'optimize'], {
      tmpl: 'Lazy optimization <%= status %> in <%= seconds %> seconds',
      bundles: this.bundles.getIds(),
      status: 'success',
      seconds: this.timer.end()
    });
  }

  logRunFailure(err) {
    // errors during initialization to the server, unlike the rest of the
    // errors produced here. Lets not muddy the console with extra errors
    if (this.initializing) return;

    this.log(['fatal', 'optimize'], {
      tmpl: 'Lazy optimization <%= status %> in <%= seconds %> seconds<%= err %>',
      bundles: this.bundles.getIds(),
      status: 'failed',
      seconds: this.timer.end(),
      err: err
    });
  }
};
